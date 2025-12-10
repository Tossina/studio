import prisma from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

export const AuthService = {
    async register(data: { email: string; password: string; username: string }) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                username: data.username,
                // Initialize other fields naturally
            },
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        return { user, token };
    },

    async login(data: { email: string; password: string }) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        return { user, token };
    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch (error) {
            return null;
        }
    },

    async getUser(userId: string) {
        return prisma.user.findUnique({ where: { id: userId } });
    }
};
