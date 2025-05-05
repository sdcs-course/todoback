const paths = {
  '/auth/google': {
    get: {
      tags: ['Auth'],
      summary: 'Инициировать Google OAuth',
      responses: {
        302: {
          description: 'Перенаправление на страницу авторизации Google'
        }
      }
    }
  },
  '/auth/google/callback': {
    get: {
      tags: ['Auth'],
      summary: 'Обработка ответа от Google OAuth',
      responses: {
        200: {
          description: 'Успешная авторизация',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' }
                }
              }
            }
          }
        },
        401: {
          description: 'Ошибка авторизации'
        }
      }
    }
  },
  '/api/todos': {
    get: {
      tags: ['Todos'],
      summary: 'Получить все задачи',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Список задач',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Todo' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Todos'],
      summary: 'Создать задачу',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title'],
              properties: {
                title: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Задача создана',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Todo' }
            }
          }
        }
      }
    }
  },
  '/api/todos/{id}': {
    patch: {
      tags: ['Todos'],
      summary: 'Обновить задачу',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                completed: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Задача обновлена',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Todo' }
            }
          }
        },
        404: {
          description: 'Задача не найдена'
        }
      }
    },
    delete: {
      tags: ['Todos'],
      summary: 'Удалить задачу',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: 'Задача удалена'
        },
        404: {
          description: 'Задача не найдена'
        }
      }
    }
  },
  '/api/todos/stats': {
    get: {
      tags: ['Todos'],
      summary: 'Получить статистику задач',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Статистика задач',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TodoStats' }
            }
          }
        }
      }
    }
  }
};

module.exports = paths; 