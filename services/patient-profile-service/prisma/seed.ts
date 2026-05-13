import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes for AES-256
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

async function main() {
  console.log('Start seeding...');
  
  await prisma.patient.deleteMany({});

  const MOCK_PATIENTS = [
    {
      name: 'João Pedro',
      age: 8,
      level: 2,
      xp: 450,
      streak: 3,
      interests: ['Dinossauros', 'Espaço'],
      emotion: 'happy',
      clinicalNotes: encrypt('Paciente em tratamento oncológico (Leucemia). Necessita de pausas frequentes.'),
      avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Joao'
    },
    {
      name: 'Maria Clara',
      age: 7,
      level: 1,
      xp: 120,
      streak: 1,
      interests: ['Princesas', 'Animais'],
      emotion: 'neutral',
      clinicalNotes: encrypt('Pós-operatório cardíaco. Evitar atividades que gerem agitação excessiva.'),
      avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Maria'
    },
    {
      name: 'Lucas',
      age: 10,
      level: 4,
      xp: 1250,
      streak: 7,
      interests: ['Futebol', 'Videogames', 'Heróis'],
      emotion: 'sad',
      clinicalNotes: encrypt('Internação prolongada por trauma ortopédico. Apresenta sinais de desânimo.'),
      avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lucas'
    }
  ];

  for (const patient of MOCK_PATIENTS) {
    const created = await prisma.patient.create({
      data: patient
    });
    console.log(`Created patient: ${created.name}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
