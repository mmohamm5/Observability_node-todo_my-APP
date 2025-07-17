require('./otel');

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

let todolist = [];

/* The to do list and the form are displayed */
app.get('/todo', function (req, res) {
  res.render('todo.ejs', {
    todolist,
    clickHandler: 'func1();'
  });
})

/* Adding an item to the to do list */
.post('/todo/add/', [
  body('newtodo').trim().escape()
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).redirect('/todo');
  }
  const newTodo = req.body.newtodo;
  if (newTodo) {
    todolist.push(newTodo);
  }
  res.redirect('/todo');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function (req, res) {
  if (req.params.id !== '') {
    todolist.splice(req.params.id, 1);
  }
  res.redirect('/todo');
})

/* Get a single todo item and render edit page */
.get('/todo/:id', function (req, res) {
  let todoIdx = req.params.id;
  let todo = todolist[todoIdx];

  if (todo) {
    res.render('edititem.ejs', {
      todoIdx,
      todo,
      clickHandler: 'func1();'
    });
  } else {
    res.redirect('/todo');
  }
})

/* Edit item in the todo list */
.put('/todo/edit/:id', [
  body('editTodo').trim().escape()
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).redirect('/todo');
  }
  let todoIdx = req.params.id;
  let editTodo = req.body.editTodo;
  if (todoIdx !== '' && editTodo) {
    todolist[todoIdx] = editTodo;
  }
  res.redirect('/todo');
})

/* Redirects to the to do list if the page requested is not found */
.use(function (req, res, next) {
  res.redirect('/todo');
})

.listen(port, function () {
  console.log(`Todolist running on http://0.0.0.0:${port}`);
});

module.exports = app;
