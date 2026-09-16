import { Request, Response } from 'express';
import { LocalStore } from '../seed/seedData';

export const calculateHydration = (req: Request, res: Response) => {
    try {
        const data = req.method === 'POST' ? req.body : req.query;

        const weight = parseFloat(data.weight as string || '70');
        const activity = (data.activity as string) || 'medium'; // low, medium, high
        const climate = (data.climate as string) || 'normal';   // normal, warm, hot

        if (isNaN(weight)) {
            return res.status(400).json({ error: 'Parámetros numéricos inválidos' });
        }

        // Base calculation: 35 ml per kg of body weight
        const baseMl = weight * 35.0;

        // Activity multiplier
        const activityAdd: Record<string, number> = {
            low: 0,
            medium: 500,
            high: 1000
        };
        const actAdd = activityAdd[activity] !== undefined ? activityAdd[activity] : 350;

        // Climate multiplier
        const climateAdd: Record<string, number> = {
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
        } else if (totalLiters > 3.0) {
            recommendedSlug = 'eco-dispenser-20l';
            recommendationReason = 'Tu alto volumen de hidratación diaria es ideal para el sistema Eco Dispenser 20L en hogar.';
        }

        const recommendedProduct = LocalStore.products.find(p => p.slug === recommendedSlug);

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
    } catch (error) {
        console.error('Error calculating hydration:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
