const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const FRONTEND_URL = 'http://165.232.73.69';

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Начать процесс аутентификации через Google
 *     description: Перенаправляет пользователя на страницу входа Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Перенаправление на Google OAuth
 */
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback URL для Google OAuth
 *     description: Обрабатывает ответ от Google OAuth и возвращает JWT токен
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен для аутентификации
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Ошибка аутентификации
 */
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`${FRONTEND_URL}?token=${token}`);
  }
);

module.exports = router; 