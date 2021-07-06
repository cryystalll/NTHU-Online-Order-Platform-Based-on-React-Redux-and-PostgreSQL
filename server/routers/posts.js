const express = require('express');
const bodyParser = require('body-parser');
const accessController = require('../middleware/access-controller.js');

const postModel = require('../model/posts.js');
const voteModel = require('../model/votes.js');
const formModel = require('../model/forms.js');

const router = express.Router();

router.use(bodyParser.json());
router.use(accessController); // Allows cross-origin HTTP requests

// List
router.get('/posts', function(req, res, next) {
    console.log('IsinList');
    const {searchText, start} = req.query;
    postModel.list(searchText, start).then(posts => {
        res.json(posts);
    }).catch(next);
});

////ListMyPost
router.get('/posts/getMyPost', function(req, res, next) {
    console.log('IsinListMyPost');
    const {searchText, auth_email, start} = req.query;
    postModel.listMyPost(searchText, auth_email, start).then(posts => {
        res.json(posts);
    }).catch(next);
});
// Create
router.post('/posts', function(req, res, next) {
    console.log('IsinCreate');
    const {postData, auth_email} = req.body;
    console.log(postData);
    console.log(auth_email);
    if (!auth_email || !postData) {
        const err = new Error('auth_email and postData are required!!!');
        err.status = 400;
        throw err;
    }
    postModel.create(postData, auth_email).then(post => {

        res.json(post);
    }).catch(next);
});

// Vote
router.post('/posts/:id/:mood(clear|clouds|drizzle|rain|thunder|snow|windy)Votes', function(req, res, next) {
    console.log('IsinVote');
    const {id, mood} = req.params;
    if (!id || !mood) {
        const err = new Error('Post ID and mood are required');
        err.status = 400;
        throw err;
    }
    voteModel.create(id, mood).then(post => {
        res.json(post);
    }).catch(next);
});




module.exports = router;
