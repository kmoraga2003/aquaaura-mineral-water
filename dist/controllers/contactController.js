"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContact = void 0;
const uuid_1 = require("uuid");
const seedData_1 = require("../seed/seedData");
const firebase_1 = require("../config/firebase");
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' });
        }
        const newMessage = {
            id: (0, uuid_1.v4)(),
            name,
            email,
            phone: phone || '',
            subject: subject || 'Consulta General',
            message,
            created_at: new Date().toISOString()
        };
        seedData_1.LocalStore.messages.push(newMessage);
        if (firebase_1.db) {
            try {
                await firebase_1.db.collection('contact_messages').doc(newMessage.id).set(newMessage);
            }
            catch (err) {
                console.error('Firestore contact error:', err);
            }
        }
        return res.json({
            success: true,
            message: '¡Gracias por contactarnos! Tu mensaje ha sido recibido por el equipo de AquaAura.'
        });
    }
    catch (error) {
        console.error('Error submitting contact form:', error);
        return res.status(500).json({ error: 'Error al procesar el mensaje.' });
    }
};
exports.submitContact = submitContact;
