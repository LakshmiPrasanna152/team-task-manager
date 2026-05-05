const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createProject(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required' });

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.userId,
        members: {
          create: { userId: req.user.userId, role: 'ADMIN' }
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getMyProjects(req, res) {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.userId },
      include: {
        project: {
          include: {
            owner: { select: { id: true, name: true, email: true } },
            members: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            },
            _count: { select: { tasks: true } }
          }
        }
      }
    });
    const projects = memberships.map(m => ({ ...m.project, myRole: m.role }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getProjectById(req, res) {
  const { id } = req.params;
  try {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId: req.user.userId } }
    });
    if (!membership) return res.status(403).json({ message: 'Access denied' });

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        tasks: {
          include: {
            creator:  { select: { id: true, name: true } },
            assignee: { select: { id: true, name: true } }
          }
        }
      }
    });
    res.json({ ...project, myRole: membership.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function inviteMember(req, res) {
  const { id } = req.params;
  const { email, role } = req.body;

  try {
    const adminCheck = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId: req.user.userId } }
    });
    if (!adminCheck || adminCheck.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can invite members' });
    }

    const targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId: targetUser.id } }
    });
    if (existing) return res.status(409).json({ message: 'User is already a member' });

    const member = await prisma.projectMember.create({
      data: { projectId: id, userId: targetUser.id, role: role || 'MEMBER' },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { createProject, getMyProjects, getProjectById, inviteMember };