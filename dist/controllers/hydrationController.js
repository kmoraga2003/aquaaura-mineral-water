"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHydration = void 0;
const seedData_1 = require("../seed/seedData");
const calculateHydration = (req, res) => {
    try {
        const data = req.method === 'POST' ? req.body : req.query;
        const weight = parseFloat(data.weight || '70');
        const activity = data.activity || 'medium'; // low, medium, high
        const climate = data.climate || 'normal'; // normal, warm, hot
        if (isNaN(weight)) {
            return res.status(400).json({ error: 'Parámetros numéricos inválidos' });
        }
        // Base calculation: 35 ml per kg of body weight
        const baseMl = weight * 35.0;
        // Activity multiplier
        const activityAdd = {
            low: 0,
            medium: 500,
            high: 1000
        };
        const actAdd = activityAdd[activity] !== undefined ? activityAdd[activity] : 350;
        // Climate multiplier
        const climateAdd = {
            normal: 0,
            warm: 400,
            hot: 800
        };
        const climAdd = climateAdd[climate] !== undefined ? climateAdd[climate] : 0;
        const totalMl = baseMl + actAdd + climAdd;
        const totalLiters = Math.round((totalMl / 1000.0) * 100) / 100;
        const glassesCount = Math.ceil(totalMl / 250.0);
        // Recommend product based on volume & activity
        let recommendedSlug = 'manantial-puro-750ml';
        let recommendationReason = 'El equilibrio neutro de pH 7.8 de nuestro Manantial Puro es óptimo para tu ingesta diaria.';
        if (activity === 'high') {
            recommendedSlug = 'mineral-balance-500ml';
            recommendationReason = 'Tu nivel de actividad requiere mayor reposición de Magnesio (28 mg/L) y Electrolitos.';
        }
        else if (totalLiters > 3.0) {
            recommendedSlug = 'eco-dispenser-20l';
            recommendationReason = 'Tu alto volumen de hidratación diaria es ideal para el sistema Eco Dispenser 20L en hogar.';
        }
        const recommendedProduct = seedData_1.LocalStore.products.find(p => p.slug === recommendedSlug);
        return res.json({
            success: true,
            weight,
            daily_liters: totalLiters,
            glasses_count: glassesCount,
            recommendation_reason: recommendationReason,
            recommended_product: {
                id: recommendedProduct ? recommendedProduct.id : 1,
                name: recommendedProduct ? recommendedProduct.name : 'AquaAura Manantial Puro',
                price: recommendedProduct ? recommendedProduct.price : 2500,
                slug: recommendedProduct ? recommendedProduct.slug : 'manantial-puro-750ml',
                container: recommendedProduct ? recommendedProduct.container_type : 'Botella 750ml'
            }
        });
    }
    catch (error) {
        console.error('Error calculating hydration:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.calculateHydration = calculateHydration;
