const express = require('express');
const bodyParser = require('body-parser');
const accessController = require('../middleware/access-controller.js'); ////

const todoModel = require('../model/todos.js');

const router = express.Router();

router.use(bodyParser.json());
router.use(accessController); // Allows cross-origin HTTP requests ////

// List
router.get('/todos', function(req, res, next) {
    const {unaccomplishedOnly, searchText, start} = req.query;
    todoModel.list(unaccomplishedOnly,searchText,start).then(todos => {
        res.json(todos);
    }).catch(next);
});

// Create
router.post('/todos', function(req, res, next) {
    const {mood, text} = req.body;
    if (!mood || !text) {
        const err = new Error('Mood and text are required');
        err.status = 400;
        throw err;
    }
    todoModel.create(mood, text).then(post => {
        res.json(post);
    }).catch(next);
});

// Accomplish
router.post('/todos/:id', function(req, res, next) {
    const {id} = req.params;
    if (!id) {
        const err = new Error('Post ID are required');
        err.status = 400;
        throw err;
    }
    todoModel.accomplish(id).then(post => {
        res.json(post);
    }).catch(next);
});

module.exports = router;
