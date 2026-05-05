const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  createProject,
  getMyProjects,
  getProjectById,
  inviteMember
} = require('../controllers/project.controller');

const router = express.Router();
router.use(authenticate);

router.post('/',           createProject);
router.get('/',            getMyProjects);
router.get('/:id',         getProjectById);
router.post('/:id/invite', inviteMember);

module.exports = router;