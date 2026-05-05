const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMembershipOrFail(projectId, userId, res) {
  const m = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
  if (!m) { res.status(403).json({ message: 'Access denied' }); return null; }
  return m;
}

async function createTask(req, res) {
  const { projectId, title, description, assigneeId, priority, dueDate } = req.body;
  if (!projectId || !title) {
    return res.status(400).json({ message: 'projectId and title required' });
  }

  try {
    const membership = await getMembershipOrFail(projectId, req.user.userId, res);
    if (!membership) return;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate:    dueDate    ? new Date(dueDate) : undefined,
        projectId,
        creatorId:  req.user.userId,
        assigneeId: assigneeId || undefined
      },
      include: {
        creator:  { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status, priority, assigneeId, dueDate } = req.body;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const membership = await getMembershipOrFail(task.projectId, req.user.userId, res);
    if (!membership) return;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title                  && { title }),
        ...(description !== undefined && { description }),
        ...(status                 && { status }),
        ...(priority               && { priority }),
        ...(assigneeId  !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate     !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      include: {
        creator:  { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const membership = await getMembershipOrFail(task.projectId, req.user.userId, res);
    if (!membership) return;

    if (membership.role !== 'ADMIN' && task.creatorId !== req.user.userId) {
      return res.status(403).json({ message: 'Only admins or task creator can delete' });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const now     = new Date();
    const myTasks = await prisma.task.findMany({
      where: { assigneeId: req.user.userId },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' }
    });

    const overdue    = myTasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'DONE');
    const todo       = myTasks.filter(t => t.status === 'TODO');
    const inProgress = myTasks.filter(t => t.status === 'IN_PROGRESS');
    const done       = myTasks.filter(t => t.status === 'DONE');

    res.json({ overdue, todo, inProgress, done, total: myTasks.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { createTask, updateTask, deleteTask, getDashboard };