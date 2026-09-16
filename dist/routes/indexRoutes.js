"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seedData_1 = require("../seed/seedData");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        let products = seedData_1.LocalStore.products;
        let plans = seedData_1.LocalStore.plans;
        if (firebase_1.db) {
            try {
                const prodSnap = await firebase_1.db.collection('products').get();
                if (!prodSnap.empty) {
                    products = prodSnap.docs.map((doc) => doc.data());
                }
                const planSnap = await firebase_1.db.collection('subscription_plans').get();
                if (!planSnap.empty) {
                    plans = planSnap.docs.map((doc) => doc.data());
                }
            }
            catch (err) {
                console.warn('Firestore fetch warning, fallback to LocalStore:', err);
            }
        }
        res.render('index', {
            products,
            plans
        });
    }
    catch (error) {
        console.error('Error rendering homepage:', error);
        res.status(500).send('Error interno cargando la página principal.');
    }
});
exports.default = router;
