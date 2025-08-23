import express from 'express';
import {
    getAllLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
} from '../Controller/Lead.controller.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllLeads);
router.get('/:id', authenticateToken, getLeadById);
router.post('/', authenticateToken, createLead);
router.put('/:id', authenticateToken, updateLead);
router.delete('/:id', authenticateToken, deleteLead);

export default router;
