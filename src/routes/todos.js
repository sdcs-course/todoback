const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const { logger } = require("../utils/logger");

// Middleware to protect routes
const jwtAuth = passport.authenticate("jwt", { session: false });

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Получить все задачи пользователя
 *     description: Возвращает список всех задач текущего пользователя
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список задач
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   completed:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Не авторизован
 */
router.get("/todos", authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (error) {
    logger.error("Error fetching todos:", error);
    res.status(500).json({ message: "Error fetching todos" });
  }
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Создать новую задачу
 *     description: Создает новую задачу для текущего пользователя
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок задачи
 *               description:
 *                 type: string
 *                 description: Описание задачи
 *     responses:
 *       201:
 *         description: Задача создана
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post("/todos", authenticate, async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    logger.error("Error creating todo:", error);
    res.status(400).json({ message: "Error creating todo" });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Обновить задачу
 *     description: Обновляет существующую задачу
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задачи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Задача обновлена
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.patch("/todos/:id", authenticate, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    logger.error("Error updating todo:", error);
    res.status(400).json({ message: "Error updating todo" });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     description: Удаляет существующую задачу
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задачи
 *     responses:
 *       200:
 *         description: Задача удалена
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.delete("/todos/:id", authenticate, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (error) {
    logger.error("Error deleting todo:", error);
    res.status(400).json({ message: "Error deleting todo" });
  }
});

router.get("/stats", authenticate, async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
        },
      },
    ]);
    res.json(stats[0] || { total: 0, completed: 0 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

module.exports = router;
