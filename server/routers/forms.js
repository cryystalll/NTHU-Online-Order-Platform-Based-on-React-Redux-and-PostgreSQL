const express = require('express');
const bodyParser = require('body-parser');
const accessController = require('../middleware/access-controller.js');

const postModel = require('../model/posts.js');
const formModel = require('../model/forms.js');

const router = express.Router();

router.use(bodyParser.json());
router.use(accessController); // Allows cross-origin HTTP requests

////Create form
router.post('/forms', function(req, res, next) {
    console.log('IsinForm');
    const {id, name, phone, drink, cups, money, comment, sugar, ice, auth_email} = req.body;
    if (!id) {
        const err = new Error('form is not created!');
        err.status = 400;
        throw err;
    }
    formModel.createForm(id, name, phone, drink, cups, money, comment, sugar, ice, auth_email).then(post => {
        res.json(post);
    }).catch(next);
});

////Listing myForm
router.get('/forms', function(req, res, next) {
    console.log('IsinListmyForm');
    const {postid, auth_email, role} = req.query;
    formModel.listForm(postid, auth_email, role).then(posts => {
        res.json(posts);
    }).catch(next);
});

////Get emails forms of the post
router.get('/forms/emails', function(req, res, next) {
    console.log('IsinGetEmails');
    const {postid} = req.query;
    formModel.listEmail(postid).then(emails => {
        res.json(emails);
    }).catch(next);
});

////To make change with checked form
router.post('/forms/check', function(req, res, next) {
    console.log('IsinCheckForm');
    const {formid, check} = req.body;
    if (!formid) {
        const err = new Error('Change Check does not work!')
        err.status = 400;
        throw err;
    }
    //console.log(name);
    formModel.updateCheck(formid, check).then(post => {
        res.json(post);
    }).catch(next);
});


module.exports = router;