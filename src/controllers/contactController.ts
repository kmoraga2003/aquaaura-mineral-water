import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ContactMessage } from '../models/types';
import { LocalStore } from '../seed/seedData';
import { db } from '../config/firebase';

export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' });
        }

        const newMessage: ContactMessage = {
            id: uuidv4(),
            name,
            email,
            phone: phone || '',
            subject: subject || 'Consulta General',
            message,
            created_at: new Date().toISOString()
        };

        LocalStore.messages.push(newMessage);

        if (db) {
            try {
                await db.collection('contact_messages').doc(newMessage.id!).set(newMessage);
            } catch (err) {
                console.error('Firestore contact error:', err);
            }
        }

        return res.json({
            success: true,
            message: '¡Gracias por contactarnos! Tu mensaje ha sido recibido por el equipo de AquaAura.'
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return res.status(500).json({ error: 'Error al procesar el mensaje.' });
    }
};
