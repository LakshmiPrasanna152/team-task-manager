const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes    = require('./routes/task.routes');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));