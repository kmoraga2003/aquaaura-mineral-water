"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const uuid_1 = require("uuid");
const seedData_1 = require("../seed/seedData");
const firebase_1 = require("../config/firebase");
const createOrder = async (req, res) => {
    try {
        const { customer_name, customer_email, customer_phone, delivery_address, items, order_type, total_amount } = req.body;
        if (!customer_name || !customer_email || !customer_phone || !delivery_address || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Por favor completa todos los campos requeridos y añade productos al carrito.' });
        }
        const fullUuid = (0, uuid_1.v4)();
        const shortOrderNum = fullUuid.slice(0, 8).toUpperCase();
        const newOrder = {
            id: fullUuid,
            order_number: shortOrderNum,
            customer_name,
            customer_email,
            customer_phone,
            delivery_address,
            order_type: order_type || 'one_time',
            items_json: JSON.stringify(items),
            total_amount: Number(total_amount) || 0,
            status: 'confirmed',
            created_at: new Date().toISOString()
        };
        // Save to LocalStore
        seedData_1.LocalStore.orders.push(newOrder);
        // Save to Firestore if connected
        if (firebase_1.db) {
            try {
                await firebase_1.db.collection('orders').doc(fullUuid).set(newOrder);
            }
            catch (err) {
                console.error('Firestore order error:', err);
            }
        }
        return res.json({
            success: true,
            order_number: shortOrderNum,
            full_id: fullUuid,
            customer_name: newOrder.customer_name,
            total: newOrder.total_amount,
            status: newOrder.status,
            status_display: 'Confirmado',
            message: '¡Tu pedido ha sido recibido e ingresado a nuestro sistema de embotellado!'
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Error al procesar la orden en el servidor.' });
    }
};
exports.createOrder = createOrder;
