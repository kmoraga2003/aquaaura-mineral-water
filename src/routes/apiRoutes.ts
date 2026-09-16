import { Router } from 'express';
import { calculateHydration } from '../controllers/hydrationController';
import { createOrder } from '../controllers/orderController';
import { submitContact } from '../controllers/contactController';

const router = Router();

router.get('/hydration-calc', calculateHydration);
router.post('/hydration-calc', calculateHydration);

router.post('/order', createOrder);

router.post('/contact', submitContact);

export default router;
