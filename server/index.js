// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const { email, password } = req.headers;

  // Find user with matching username and password
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Set the user object on the request and call the next middleware
  req.user = user;
  next();
};

// Create local variables for storing user data
let users = [
  { id: 1, username: "user1", password: "pass1", email: "user1@gmail.com" },
  { id: 2, username: "user2", password: "pass2", email: "user2@gmail.com" },
];

// Create local variables for storing todo data
let todos = [
  { userId: 1, id: 1, title: "Learn Node.js", isCompleted: false },
  { userId: 1, id: 2, title: "Build a REST API", isCompleted: false },
  { userId: 2, id: 3, title: "Learn React", isCompleted: false },
];

// Signup endpoint
// Signup endpoint
app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;

  // Check if username already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Create new user object with unique id and store in local variable
  const id = users.length + 1;
  const newUser = { id, username, password, email };
  users.push(newUser);

  // Return success message
  return res.status(201).json({ message: "Signup successful", user: newUser });
});

app.put("/profile", (req, res) => {
  const { id } = req.body;
  const { username, password, email } = req.body;

  // Find the user by id
  const user = users.find((user) => user.id === parseInt(id));

  // If user not found, return error message
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user information
  user.username = username || user.username;
  user.password = password || user.password;
  user.email = email || user.email;

  // Return success message
  return res.status(200).json({ message: "Profile updated", user });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user with matching username and password
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Return success message
  return res.status(200).json({ message: "Login successful", user });
});

// Add todo endpoint
app.post("/todos", authMiddleware, (req, res) => {
  const { title, isCompleted } = req.body;
  const { id } = req.user;

  // Create new todo object with unique id and store in local variable
  const todoId = todos.length + 1;
  const newTodo = { userId: id, id: todoId, title, isCompleted };
  todos.push(newTodo);

  // Return success message
  return res.status(201).json({ message: "Todo added successfully" });
});

// Get todos endpoint
app.get("/todos", authMiddleware, (req, res) => {
  const { id } = req.user;

  const tds = todos.filter((todo) => todo.userId === id);

  // Return success message
  return res.json({ todos: tds });
});

// Delete todo endpoint
app.delete("/todos", authMiddleware, (req, res) => {
  const { id } = req.body;
  const { id: userId } = req.user;

  // Find todo with matching id and user id
  const todoIndex = todos.findIndex(
    (todo) => todo.id === Number(id) && todo.userId === userId
  );
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Remove todo from local variable
  todos.splice(todoIndex, 1);

  // Return success message
  return res.status(200).json({ message: "Todo deleted successfully" });
});

// Edit todo endpoint
app.patch("/todos", authMiddleware, (req, res) => {
  const { id: userId } = req.user;
  const { id, title, isCompleted } = req.body;

  // Find todo with matching id and user id
  const todoIndex = todos.findIndex(
    (todo) => todo.id === Number(id) && todo.userId === userId
  );
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Update todo object in local variable
  const updatedTodo = { ...todos[todoIndex], title, isCompleted };
  todos[todoIndex] = updatedTodo;

  // Return success message
  return res.status(200).json({ message: "Todo updated successfully" });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
