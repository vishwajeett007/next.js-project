import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock DB for demonstration if PostgreSQL is not connected
let mockBudget = {
    income: 0,
    bills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
    lastUpdated: new Date().toISOString(),
};

// Optional: PostgreSQL Setup
const pool = process.env.DATABASE_URL ? new Pool({
    connectionString: process.env.DATABASE_URL,
}) : null;

if (pool) {
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });
}

// Routes
app.post('/api/budget/sync', async (req: Request, res: Response) => {
    const budget = req.body;
    console.log('Syncing budget:', budget);

    try {
        // Attempt to save to PostgreSQL
        if (pool) {
            await pool.query(
                'INSERT INTO budgets (data, updated_at) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = $2',
                [JSON.stringify(budget), new Date()]
            );
        }

        // Always update mock for demo
        mockBudget = { ...budget, lastUpdated: new Date().toISOString() };

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Synced successfully',
        });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ success: false, message: 'Failed to sync' });
    }
});

app.get('/api/budget/latest', async (req: Request, res: Response) => {
    try {
        if (pool) {
            const result = await pool.query('SELECT data FROM budgets ORDER BY updated_at DESC LIMIT 1');
            if (result.rows.length > 0) {
                return res.json(result.rows[0].data);
            }
        }

        res.json(mockBudget);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch latest budget' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
