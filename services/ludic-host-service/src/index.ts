import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function startRedis() {
  await redisClient.connect();
  console.log('Connected to Redis for Gamification');
}
startRedis();

app.get('/health', (req, res) => res.send('Ludic Host Service is running'));

// Add XP to a patient
app.post('/api/gamification/xp', async (req, res) => {
  const { patientId, amount } = req.body;
  
  if (!patientId || !amount) {
    return res.status(400).json({ error: 'Missing patientId or amount' });
  }

  try {
    const newXp = await redisClient.incrBy(`patient:${patientId}:xp`, amount);
    // Determine level based on XP (e.g. 100 XP per level)
    const newLevel = Math.floor(newXp / 100) + 1;
    
    // Also track streak
    const lastActiveStr = await redisClient.get(`patient:${patientId}:lastActive`);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    let streak = Number(await redisClient.get(`patient:${patientId}:streak`) || 0);

    if (lastActiveStr !== today) {
      if (lastActiveStr) {
        const lastActiveDate = new Date(lastActiveStr);
        const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          streak += 1;
        } else if (diffDays > 1) {
          streak = 1; // reset streak
        }
      } else {
        streak = 1; // first time
      }
      
      await redisClient.set(`patient:${patientId}:lastActive`, today);
      await redisClient.set(`patient:${patientId}:streak`, streak);
    }

    res.json({ patientId, xp: newXp, level: newLevel, streak });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process gamification' });
  }
});

app.listen(PORT, () => {
  console.log(`Ludic Host Service listening on port ${PORT}`);
});
