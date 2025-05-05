 # Todo Backend API

Backend API для приложения Todo с аутентификацией через Google OAuth.

## Технологии

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (Google OAuth)
- JWT
- Swagger/OpenAPI

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd todoback
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

4. Запустите MongoDB:
```bash
mongod
```

5. Запустите сервер:
```bash
npm run dev
```

## API Endpoints

### Аутентификация

#### GET /auth/google
- Инициирует процесс аутентификации через Google
- Перенаправляет на страницу входа Google

#### GET /auth/google/callback
- Обрабатывает ответ от Google OAuth
- Возвращает JWT токен

### Задачи (Todos)

#### GET /api/todos
- Получает все задачи текущего пользователя
- Требует JWT токен
- Возвращает массив задач

#### POST /api/todos
- Создает новую задачу
- Требует JWT токен
- Тело запроса:
```json
{
  "title": "Название задачи",
  "description": "Описание задачи"
}
```

#### PATCH /api/todos/:id
- Обновляет существующую задачу
- Требует JWT токен
- Тело запроса:
```json
{
  "title": "Новое название",
  "description": "Новое описание",
  "completed": true
}
```

#### DELETE /api/todos/:id
- Удаляет задачу
- Требует JWT токен

#### GET /api/todos/stats
- Получает статистику задач пользователя
- Требует JWT токен
- Возвращает:
```json
{
  "total": 10,
  "completed": 5
}
```

## Документация API

Swagger UI доступен по адресу: `http://localhost:5000/api-docs`

## Тестирование API

1. Получите токен:
   - Перейдите по адресу `http://localhost:5000/auth/google`
   - Войдите через Google
   - Скопируйте полученный токен

2. В Swagger UI:
   - Нажмите кнопку "Authorize" в правом верхнем углу
   - Вставьте токен в формате: `Bearer ваш_токен`
   - Теперь можно тестировать все защищенные эндпоинты

## Структура проекта

```
todoback/
├── src/
│   ├── config/
│   │   ├── passport.js
│   │   ├── swagger.js
│   │   ├── swagger-paths.js
│   │   └── swagger-schemas.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Todo.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── utils/
│   │   └── logger.js
│   └── index.js
├── .env
├── .gitignore
├── nodemon.json
├── package.json
└── README.md
```

## Безопасность

- JWT аутентификация
- Rate limiting для защиты от DDoS
- Helmet для защиты заголовков
- Валидация входных данных
- Защита от NoSQL инъекций
- Безопасные заголовки CORS

## Логирование

- Winston для структурированного логирования
- Отдельные файлы для ошибок и общей информации
- Логирование в консоль в режиме разработки

## Обработка ошибок

- Централизованный обработчик ошибок
- Валидация ошибок MongoDB
- Безопасные сообщения об ошибках в production
- Логирование стека ошибок

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Запуск тестов
npm test
```

