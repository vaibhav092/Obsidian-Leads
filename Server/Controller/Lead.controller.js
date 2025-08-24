import prisma from '../lib/prisma.js';

const buildFilterConditions = (filters) => {
    const conditions = {};

    if (!filters) return conditions;

    Object.keys(filters).forEach((key) => {
        const filter = filters[key];

        if (!filter || !filter.operator || filter.value === undefined) return;

        const { operator, value } = filter;

        switch (key) {
            case 'email':
            case 'company':
            case 'city':
                if (operator === 'equals') {
                    conditions[key] = { equals: value };
                } else if (operator === 'contains') {
                    conditions[key] = { contains: value, mode: 'insensitive' };
                }
                break;

            case 'status':
            case 'source':
                if (operator === 'equals') {
                    conditions[key] = { equals: value };
                } else if (operator === 'in' && Array.isArray(value)) {
                    conditions[key] = { in: value };
                }
                break;

            case 'score':
            case 'leadValue':
                if (operator === 'equals') {
                    conditions[key] = { equals: parseFloat(value) };
                } else if (operator === 'gt') {
                    conditions[key] = { gt: parseFloat(value) };
                } else if (operator === 'lt') {
                    conditions[key] = { lt: parseFloat(value) };
                } else if (operator === 'between' && Array.isArray(value) && value.length === 2) {
                    conditions[key] = {
                        gte: parseFloat(value[0]),
                        lte: parseFloat(value[1]),
                    };
                }
                break;

            case 'created_at':
                if (operator === 'on') {
                    const date = new Date(value);
                    const nextDay = new Date(date);
                    nextDay.setDate(date.getDate() + 1);
                    conditions.createdAt = {
                        gte: date,
                        lt: nextDay,
                    };
                } else if (operator === 'before') {
                    conditions.createdAt = { lt: new Date(value) };
                } else if (operator === 'after') {
                    conditions.createdAt = { gt: new Date(value) };
                } else if (operator === 'between' && Array.isArray(value) && value.length === 2) {
                    conditions.createdAt = {
                        gte: new Date(value[0]),
                        lte: new Date(value[1]),
                    };
                }
                break;

            case 'last_activity_at':
                if (operator === 'on') {
                    const date = new Date(value);
                    const nextDay = new Date(date);
                    nextDay.setDate(date.getDate() + 1);
                    conditions.lastActivityAt = {
                        gte: date,
                        lt: nextDay,
                    };
                } else if (operator === 'before') {
                    conditions.lastActivityAt = { lt: new Date(value) };
                } else if (operator === 'after') {
                    conditions.lastActivityAt = { gt: new Date(value) };
                } else if (operator === 'between' && Array.isArray(value) && value.length === 2) {
                    conditions.lastActivityAt = {
                        gte: new Date(value[0]),
                        lte: new Date(value[1]),
                    };
                }
                break;

            case 'is_qualified':
                if (operator === 'equals') {
                    conditions.isQualified = { equals: Boolean(value) };
                }
                break;
        }
    });

    return conditions;
};

export const getAllLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const filters = {};
        Object.keys(req.query).forEach((key) => {
            if (key !== 'page' && key !== 'limit') {
                try {
                    filters[key] = JSON.parse(req.query[key]);
                } catch (e) {
                    filters[key] = { operator: 'equals', value: req.query[key] };
                }
            }
        });

        const whereConditions = buildFilterConditions(filters);

        // Add user filter to ensure users only see their own leads
        whereConditions.userId = req.user.userId;

        const total = await prisma.lead.count({
            where: whereConditions,
        });

        const leads = await prisma.lead.findMany({
            where: whereConditions,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);

        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        res.json({
            success: true,
            data: leads,
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leads' });
    }
};

export const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await prisma.lead.findFirst({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        res.json({ success: true, lead });
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch lead' });
    }
};

export const createLead = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            company,
            city,
            state,
            source,
            status = 'new',
            score = 0,
            leadValue,
            isQualified = false,
        } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required',
            });
        }

        // Validate enum values
        const validSources = [
            'website',
            'facebook_ads',
            'google_ads',
            'referral',
            'events',
            'other',
        ];
        const validStatuses = ['new', 'contacted', 'qualified', 'lost', 'won'];

        if (source && !validSources.includes(source)) {
            return res.status(400).json({
                success: false,
                message: `Invalid source value. Must be one of: ${validSources.join(', ')}`,
            });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const existingLead = await prisma.lead.findFirst({
            where: {
                email,
                userId: req.user.userId,
            },
        });

        if (existingLead) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists for your account',
            });
        }

        const lead = await prisma.lead.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                company,
                city,
                state,
                source: source || 'other', // Default to 'other' if not provided
                status,
                score,
                leadValue,
                isQualified,
                lastActivityAt: new Date(),
                userId: req.user.userId,
            },
        });

        res.status(201).json({ success: true, lead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({
            error: error.message,
            success: false,
            message: 'Failed to create lead',
        });
    }
};

export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate enum values if they are being updated
        const validSources = [
            'website',
            'facebook_ads',
            'google_ads',
            'referral',
            'events',
            'other',
        ];
        const validStatuses = ['new', 'contacted', 'qualified', 'lost', 'won'];

        if (updateData.source && !validSources.includes(updateData.source)) {
            return res.status(400).json({
                success: false,
                message: `Invalid source value. Must be one of: ${validSources.join(', ')}`,
            });
        }

        if (updateData.status && !validStatuses.includes(updateData.status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        updateData.lastActivityAt = new Date();

        const existingLead = await prisma.lead.findFirst({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!existingLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        const lead = await prisma.lead.update({
            where: { id },
            data: updateData,
        });

        res.json({ success: true, lead });
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({
            error: error.message,
            success: false,
            message: 'Failed to update lead',
        });
    }
};

export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        const existingLead = await prisma.lead.findFirst({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!existingLead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        await prisma.lead.delete({
            where: { id },
        });

        res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ success: false, message: 'Failed to delete lead' });
    }
};
