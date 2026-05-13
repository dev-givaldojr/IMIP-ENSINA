import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import amqp from 'amqplib';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://imip_admin:imip_password@rabbitmq:5672/';

let channel: amqp.Channel | null = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('generate_media', { durable: true });
    console.log('Connected to RabbitMQ (generate_media queue)');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    setTimeout(connectRabbitMQ, 5000); // Retry
  }
}

connectRabbitMQ();

app.get('/health', (req, res) => res.send('Pedagogical Progress Service is running'));

// Get patient active sessions
app.get('/api/progress/:patientId', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { patientId: req.params.patientId }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Complete a task and request new media
app.post('/api/progress/task-complete', async (req, res) => {
  const { patientId, taskId, difficulty, theme } = req.body;
  
  if (channel) {
    const payload = {
      patientId,
      taskId,
      difficulty,
      theme,
      timestamp: new Date().toISOString()
    };
    channel.sendToQueue('generate_media', Buffer.from(JSON.stringify(payload)), { persistent: true });
    res.json({ message: 'Task logged and media requested', status: 'processing' });
  } else {
    res.status(500).json({ error: 'Message broker not available' });
  }
});

app.listen(PORT, () => {
  console.log(`Pedagogical Progress Service listening on port ${PORT}`);
});
