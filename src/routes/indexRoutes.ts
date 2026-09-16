import { Router, Request, Response } from 'express';
import { LocalStore } from '../seed/seedData';
import { db } from '../config/firebase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        let products = LocalStore.products;
        let plans = LocalStore.plans;

        if (db) {
            try {
                const prodSnap = await db.collection('products').get();
                if (!prodSnap.empty) {
                    products = prodSnap.docs.map((doc: any) => doc.data());
                }
                const planSnap = await db.collection('subscription_plans').get();
                if (!planSnap.empty) {
                    plans = planSnap.docs.map((doc: any) => doc.data());
                }
            } catch (err) {
                console.warn('Firestore fetch warning, fallback to LocalStore:', err);
            }
        }

        res.render('index', {
            products,
            plans
        });
    } catch (error) {
        console.error('Error rendering homepage:', error);
        res.status(500).send('Error interno cargando la página principal.');
    }
});

export default router;
