const schemas = {
  Todo: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      completed: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      email: { type: 'string' },
      name: { type: 'string' }
    }
  },
  TodoStats: {
    type: 'object',
    properties: {
      total: { type: 'number', description: 'Общее количество задач' },
      completed: { type: 'number', description: 'Количество выполненных задач' }
    }
  }
};

module.exports = schemas; 