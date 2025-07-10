const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

let todos = []; // in-memory todo list

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Show all todos
app.get("/", (req, res) => {
  const { priority } = req.query;
  const filtered = priority ? todos.filter(t => t.priority === priority) : todos;
  res.render("index", { todos: filtered });
});

// Add new todo
app.post("/add", (req, res) => {
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.send("<script>alert('Please enter a task!'); window.history.back();</script>");
  }
  todos.push({ id: Date.now(), task, priority });
  res.redirect("/");
});

// Edit todo
app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { task, priority } = req.body;
  todos = todos.map(t => t.id == id ? { ...t, task, priority } : t);
  res.redirect("/");
});

// Delete todo
app.delete("/delete/:id", (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Todo App running at http://localhost:${port}`);
});