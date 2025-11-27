// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // Вы можете использовать любой другой порт
// Импортируем библиотеку morgan для логирования
const morgan = require('morgan');
// Импортируем валидацию
const { validateTodo } = require('./middleware/validation');

// Настройка CORS для работы с Tauri по IP
app.use(cors({
  origin: true, // Разрешаем все источники для разработки
  credentials: true
}));

// Добавьте промежуточное ПО (middleware) для обработки JSON
app.use(express.json());
// Устанавливаем morgan в режим 'combined'
app.use(morgan('combined'));

// Простой массив для хранения заметок
let todos = [];

// Роут для получения всех заметок
app.get('/todos', (req, res) => {
  res.json(todos);
  console.log(todos);
});

// Роут для создания новой заметки с валидацией
app.post('/todos', validateTodo, (req, res) => {
  const newTodo = req.validatedTodo;
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
