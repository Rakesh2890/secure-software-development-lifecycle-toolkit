const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static("public"));

let tasks = [];
let nextId = 1;

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Secure Task Manager backend is running"
    });
});

// Get tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Also support /tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Add task
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const cleanTitle = title.trim();

    if (cleanTitle.length === 0) {
        return res.status(400).json({
            error: "Task title cannot be empty"
        });
    }

    if (cleanTitle.length > 200) {
        return res.status(400).json({
            error: "Task title cannot exceed 200 characters"
        });
    }

    const task = {
        id: nextId++,
        title: cleanTitle,
        completed: false
    };

    tasks.push(task);

    res.status(201).json(task);
});

// Also support /tasks
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const task = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(task);

    res.status(201).json(task);
});

// Update task
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
            error: "completed must be true or false"
        });
    }

    task.completed = req.body.completed;

    res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log("========================================");
    console.log("     SECURE TASK MANAGER");
    console.log("========================================");
    console.log(`Application: http://localhost:${PORT}`);
    console.log(`Health:      http://localhost:${PORT}/api/health`);
    console.log(`Tasks:       http://localhost:${PORT}/api/tasks`);
    console.log("========================================");
});