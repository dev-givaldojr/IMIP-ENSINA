"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Fake encryption key for demo purposes. In production, this comes from secure env vars!
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes for AES-256
const IV_LENGTH = 16;
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
app.get('/health', (req, res) => res.send('Patient Profile Service is running'));
// List all patients (non-sensitive data)
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            select: {
                id: true,
                name: true,
                age: true,
                level: true,
                xp: true,
                streak: true,
                interests: true,
                emotion: true,
                avatarUrl: true,
                // Notice: clinicalNotes are EXCLUDED intentionally
            }
        });
        res.json(patients);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Get specific patient (requires authorization headers checking at the gateway!)
app.get('/api/patients/:id', async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id }
        });
        if (!patient)
            return res.status(404).json({ error: 'Patient not found' });
        // Decrypt sensitive notes before sending to authorized frontend
        let decryptedNotes = '';
        if (patient.clinicalNotes) {
            try {
                decryptedNotes = decrypt(patient.clinicalNotes);
            }
            catch (e) {
                decryptedNotes = 'Error decrypting data. Invalid key or corrupted data.';
            }
        }
        res.json({
            ...patient,
            clinicalNotes: decryptedNotes
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Patient Profile Service listening on port ${PORT}`);
});
