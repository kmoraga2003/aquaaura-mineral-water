export interface Product {
    id: number | string;
    name: string;
    slug: string;
    tagline: string;
    category: 'still' | 'sparkling' | 'infused' | 'eco';
    volume_ml: number;
    container_type: string;
    price: number;
    ph_level: number;
    tds_mg_l: number;
    calcium_mg_l: number;
    magnesium_mg_l: number;
    potassium_mg_l: number;
    silica_mg_l: number;
    description: string;
    badge?: string;
    icon_type: string;
    is_active: boolean;
    created_at?: string;
}

export interface SubscriptionPlan {
    id: number | string;
    name: string;
    slug: string;
    frequency_days: number;
    discount_percent: number;
    description: string;
    icon_name: string;
}

export interface CartItem {
    id: number | string;
    name: string;
    price: number;
    slug: string;
    container?: string;
    qty: number;
}

export interface Order {
    id?: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    order_type: 'one_time' | 'subscription';
    items_json: string;
    total_amount: number;
    status: 'confirmed' | 'bottling' | 'delivering' | 'completed';
    created_at: string;
}

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    created_at: string;
}
