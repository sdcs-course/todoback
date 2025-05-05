const swaggerJsdoc = require('swagger-jsdoc');
const schemas = require('./swagger-schemas');
const paths = require('./swagger-paths');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API Documentation',
      version: '1.0.0',
      description: 'API documentation for Todo application with Google OAuth\n\n' +
                  'Для тестирования API:\n' +
                  '1. Перейдите по адресу /auth/google\n' +
                  '2. Войдите через Google\n' +
                  '3. Скопируйте полученный токен\n' +
                  '4. Нажмите кнопку "Authorize" в правом верхнем углу\n' +
                  '5. Вставьте токен в формате: Bearer ваш_токен',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT токен, полученный после авторизации через Google OAuth'
        },
      },
    },
    paths,
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.js'], // Путь к файлам с маршрутами
};

const specs = swaggerJsdoc(options);
module.exports = specs; 