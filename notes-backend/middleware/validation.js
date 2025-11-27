const validateTodo = (req, res, next) => {
    const body = req.body;

    // Проверка наличия поля "id" и "title"
    let error = {};
    if (!body.id) {
        error.id = "ID is required"
    }
    if (!body.title) {
        error.title = "Title is required"
    }
    if (error.id || error.title) {
        return res.status(400).json({ error })
    }

    // Задаем значения по умолчанию для "content" и "completed"
    const content = body.content || '';
    const completed = body.completed || false;

    // Создаем объект с валидированными данными
    req.validatedTodo = {
        id: body.id,
        title: body.title,
        content: content,
        completed: completed
    };

    // Переходим к следующему обработчику
    next();
};

// Экспорт функции валидации
module.exports = {
    validateTodo
};
