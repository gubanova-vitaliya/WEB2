// index.js
const express = require('express');
const app = express();
const port = 3000; // Вы можете использовать любой другой порт

// CORS middleware для разрешения запросов с разных источников
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Добавьте промежуточное ПО (middleware) для обработки JSON
app.use(express.json());

// Простой массив для хранения заметок
let todos = [];

// Роут для получения всех заметок
app.get('/todos', (req, res) => {
  res.json(todos);
  console.log(todos);
});

// Роут для создания новой заметки
app.post('/todos', (req, res) => {
  const { id, title, content } = req.body;
  const newTodo = { id, title, content };
  todos.push(newTodo);
  res.status(201).json(newTodo);
  console.log(todos);
});

// Роут для обновления существующей заметки
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos[todoIndex] = { id, title, content };
    res.json(todos[todoIndex]);
  } else {
    res.status(404).json({ error: 'Заметка не найдена' });
  }
});

// Роут для удаления заметки
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== id);
  res.status(204).end();
});

// Старт сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  
  // Показываем IP адреса для подключения
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  console.log('\n🌐 Доступные адреса для подключения:');
  console.log(`   Localhost: http://localhost:${port}`);
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((network) => {
      if (network.family === 'IPv4' && !network.internal) {
        console.log(`   Локальная сеть: http://${network.address}:${port}`);
      }
    });
  });
  
  console.log('\n📝 Для Tauri используйте IP локальной сети (не localhost)');
});
