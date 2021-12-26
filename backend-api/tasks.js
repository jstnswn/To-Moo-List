const express = require('express');
const router = express.Router();
const taskService = require('./services/task-service');
const { asyncHandler, taskNotFound, validateCategory, validateTask } = require('../utils');

// get all tasks
router.get('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);

    const userId = res.locals.user.id;
    const task = await taskService.getTaskByPkAndUser(taskId, userId);

    if (task) {
        res.status(200);
        res.json({ task });
    } else {
        next(taskNotFound(taskId));
    }
}));

// get completed tasks
router.get('/tasks/completed', asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;

    const tasks = await taskService.getTasksByUser(userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else {
        next(taskNotFound());
    }
}));

// get tasks by date
router.get('/tasks/today', asyncHandler(async (req, res, next) => {
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const userId = res.locals.user.id
    const tasks = await taskService.getTasksByDate(today, yesterday, userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}))

router.get('/tasks/tomorrow', asyncHandler(async (req, res, next) => {
    const today = new Date();
    let twoDaysAhead = new Date();
    twoDaysAhead.setDate(today.getDate() + 2);
    let yesterday = new Date();
    yesterday.setDate(today.getDate());

    const userId = res.locals.user.id
    const tasks = await taskService.getTasksByDate(twoDaysAhead, yesterday, userId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}));

// post new task
router.post('/lists/:id(\\d+)', validateTask, asyncHandler(async (req, res) => {
    let { name, listId } = req.body;
    listId = parseInt(listId, 10)
    const userId = res.locals.user.id;

    let task = await taskService.createTask(name, userId, listId);
    task = await taskService.getTaskByPk(task.id);

    res.status(201);
    res.json({ task });
}));

// put --- delete since not using??
router.put('/tasks/:id(\\d+)', validateTask, asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await taskService.getTaskByPk(taskId);

    if (task) {
        await taskService.updateTask(task, req.body);

        res.status(200);
        res.json({ task });
    } else {
        next(taskNotFound(taskId));
    }
}));

// patch a task
router.patch('/tasks/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    let task = await taskService.getTaskByPk(taskId);

    if (task) {
        await taskService.updateTask(task, req.body);
        task = await taskService.getTaskByPk(taskId);

        res.status(200);
        res.json({ task }) //may need to change;
    } else {
        next(taskNotFound(taskId));
    }
}));

// delete a task
router.delete('/tasks/:id(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    const task = await taskService.getTaskByPk(taskId);

    if (task) {
        await taskService.deleteTask(task);
        res.status(204).end();
    } else {
        next(taskNotFound(taskId));
    }
}))

// getting all tasks by userId
router.get('/tasks', asyncHandler(async (req, res) => {
    const userId = res.locals.user.id

    const tasks = await taskService.getTasksByUser(userId);

    res.json({ tasks });
}));

// Getting tasks by listId
router.get('/lists/:listId/tasks', asyncHandler(async (req, res, next) => { // put in lists router bc of teh endpoint
    const listId = req.params.listId;

    const tasks = await taskService.getTasksByListId(listId);

    if (tasks) {
        res.status(200);
        res.json({ tasks });
    } else next(taskNotFound())
}));


module.exports = router;
