import { Product, SubscriptionPlan, Order, ContactMessage } from '../models/types';
import { db } from '../config/firebase';

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "AquaAura Manantial Puro",
        slug: "manantial-puro-750ml",
        tagline: "Filtración milenaria en roca volcánica andina",
        category: "still",
        volume_ml: 750,
        container_type: "Botella de Vidrio 750ml",
        price: 2500,
        ph_level: 7.8,
        tds_mg_l: 165.0,
        calcium_mg_l: 42.0,
        magnesium_mg_l: 16.0,
        potassium_mg_l: 4.2,
        silica_mg_l: 32.0,
        description: "Nuestra agua insignia embotellada directamente en el manantial virgen a 2.800 metros de altitud. De sabor equilibrado y pureza cristalina.",
        badge: "Insignia",
        icon_type: "still",
        is_active: true
    },
    {
        id: 2,
        name: "AquaAura Sparkling Crystal",
        slug: "sparkling-crystal-750ml",
        tagline: "Burbuja fina de efervescencia natural",
        category: "sparkling",
        volume_ml: 750,
        container_type: "Botella de Vidrio 750ml",
        price: 2900,
        ph_level: 6.8,
        tds_mg_l: 210.0,
        calcium_mg_l: 48.0,
        magnesium_mg_l: 22.0,
        potassium_mg_l: 5.5,
        silica_mg_l: 28.0,
        description: "Gasificación suave con anhídrido carbónico de origen mineral volcánico. Ideal para maridar con gastronomía de alta gama.",
        badge: "Burbuja Fina",
        icon_type: "sparkling",
        is_active: true
    },
    {
        id: 3,
        name: "AquaAura Mineral Balance",
        slug: "mineral-balance-500ml",
        tagline: "Enriquecida en magnesio y sílice para tu día activo",
        category: "infused",
        volume_ml: 500,
        container_type: "Envase rPET 100% Reciclado 500ml",
        price: 1800,
        ph_level: 8.1,
        tds_mg_l: 240.0,
        calcium_mg_l: 55.0,
        magnesium_mg_l: 28.0,
        potassium_mg_l: 8.0,
        silica_mg_l: 45.0,
        description: "Optimizada para la recuperación muscular y el equilibrio electrolítico diario. Presentación liviana e inastillable.",
        badge: "Rendimiento",
        icon_type: "infused",
        is_active: true
    },
    {
        id: 4,
        name: "AquaAura Eco Dispenser 20L",
        slug: "eco-dispenser-20l",
        tagline: "Formato de recarga sustentable para hogar u oficina",
        category: "eco",
        volume_ml: 20000,
        container_type: "Bidón Retornable Libre de BPA 20 Litros",
        price: 9500,
        ph_level: 7.8,
        tds_mg_l: 170.0,
        calcium_mg_l: 44.0,
        magnesium_mg_l: 17.0,
        potassium_mg_l: 4.5,
        silica_mg_l: 30.0,
        description: "Elimina el plástico de un solo uso con nuestro sistema de retorno automatizado. Incluye envío rápido a domicilio.",
        badge: "Ecológico 100%",
        icon_type: "eco",
        is_active: true
    },
    {
        id: 5,
        name: "AquaAura Reserva Edición Negra",
        slug: "reserva-negra-1000ml",
        tagline: "Cosecha de manantial profundo en vidrio ahumado",
        category: "still",
        volume_ml: 1000,
        container_type: "Edición Colección Vidrio 1 Litro",
        price: 5900,
        ph_level: 8.2,
        tds_mg_l: 190.0,
        calcium_mg_l: 50.0,
        magnesium_mg_l: 20.0,
        potassium_mg_l: 6.0,
        silica_mg_l: 50.0,
        description: "Embotellada en pequeñas tandas de manantiales protegidos. Alta concentración de oligoelementos vitales y textura sedosa.",
        badge: "Edición Exclusiva",
        icon_type: "reserve",
        is_active: true
    },
    {
        id: 6,
        name: "AquaAura Infusionada Cítrica",
        slug: "infused-citrica-500ml",
        tagline: "Manantial con extracto natural de limón & menta silvestre",
        category: "infused",
        volume_ml: 500,
        container_type: "Botella de Vidrio 500ml",
        price: 3200,
        ph_level: 7.2,
        tds_mg_l: 175.0,
        calcium_mg_l: 40.0,
        magnesium_mg_l: 18.0,
        potassium_mg_l: 5.0,
        silica_mg_l: 31.0,
        description: "Saborizado naturalmente sin azúcares, endulzantes ni calorías. Sabor fresco e hidratación revitalizante.",
        badge: "Sin Azúcar",
        icon_type: "infused",
        is_active: true
    }
];

export const INITIAL_PLANS: SubscriptionPlan[] = [
    {
        id: 1,
        name: "Suscripción Hidratación Diaria",
        slug: "semanal",
        frequency_days: 7,
        discount_percent: 20,
        description: "Despacho automatizado cada semana. Ideal para personas activas y deportistas.",
        icon_name: "zap"
    },
    {
        id: 2,
        name: "Suscripción Familia Manantial",
        slug: "quincenal",
        frequency_days: 14,
        discount_percent: 15,
        description: "Recibe un pack mixto o bidones retornables cada 2 semanas directamente en tu puerta.",
        icon_name: "home"
    },
    {
        id: 3,
        name: "Suscripción Empresa & Salud",
        slug: "mensual",
        frequency_days: 30,
        discount_percent: 10,
        description: "Abastecimiento mensual programado para oficinas, locales o consumo familiar sostenido.",
        icon_name: "building"
    }
];

// In-Memory fallback store for development
export class LocalStore {
    public static products: Product[] = [...INITIAL_PRODUCTS];
    public static plans: SubscriptionPlan[] = [...INITIAL_PLANS];
    public static orders: Order[] = [];
    public static messages: ContactMessage[] = [];
}

export async function seedFirestore() {
    if (!db) {
        console.log('Using LocalStore for dev mode.');
        return;
    }
    try {
        const prodRef = db.collection('products');
        for (const p of INITIAL_PRODUCTS) {
            await prodRef.doc(p.slug).set(p);
        }
        const planRef = db.collection('subscription_plans');
        for (const plan of INITIAL_PLANS) {
            await planRef.doc(plan.slug).set(plan);
        }
        console.log('✅ Firestore populated with initial products and plans.');
    } catch (e) {
        console.error('Error seeding Firestore:', e);
    }
}
