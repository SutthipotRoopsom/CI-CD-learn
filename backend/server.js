const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // ✅ CORS มีแล้ว
app.use(express.json());

// สร้างโฟลเดอร์ logs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// ✅ เพิ่ม: Dummy tasks data (หรือดึงจาก Prisma)
let tasks = [
    { id: 1, title: 'Sample Task 1', completed: false, createdAt: new Date() },
    { id: 2, title: 'Sample Task 2', completed: true, createdAt: new Date() }
];

// Endpoints เดิม
app.get('/', (req, res) => {
    res.send('Backend is running! Access /api/demo or /api/tasks for data.');
});

app.get('/api/demo', (req, res) => {
    const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
    fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);
    res.json({
        git: {
            title: 'Advanced Git Workflow',
            detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด'
        },
        docker: {
            title: 'Advanced Docker',
            detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm'
        }
    });
});

// ✅ เพิ่ม: Tasks endpoints
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    res.json({ message: 'Task deleted' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});