import json
import math
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from water_app.models import Product, SubscriptionPlan, Order, ContactMessage

@ensure_csrf_cookie
def home_view(request):
    products = Product.objects.filter(is_active=True)
    plans = SubscriptionPlan.objects.all()
    
    context = {
        'products': products,
        'plans': plans,
    }
    return render(request, 'water_app/index.html', context)


def api_calculate_hydration(request):
    if request.method not in ['GET', 'POST']:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            data = request.POST
    else:
        data = request.GET

    try:
        weight = float(data.get('weight', 70))
        activity = data.get('activity', 'medium')  # low, medium, high
        climate = data.get('climate', 'normal')    # normal, warm, hot
    except ValueError:
        return JsonResponse({'error': 'Parámetros numéricos inválidos'}, status=400)

    # Base calculation: 35 ml per kg of body weight
    base_ml = weight * 35.0

    # Activity multiplier
    activity_add = {
        'low': 0,
        'medium': 500,
        'high': 1000
    }.get(activity, 350)

    # Climate multiplier
    climate_add = {
        'normal': 0,
        'warm': 400,
        'hot': 800
    }.get(climate, 0)

    total_ml = base_ml + activity_add + climate_add
    total_liters = round(total_ml / 1000.0, 2)
    glasses_count = math.ceil(total_ml / 250.0)

    # Recommend product based on volume & activity
    if activity == 'high':
        recommended_product_slug = 'mineral-balance-500ml'
        recommendation_reason = 'Tu nivel de actividad requiere mayor reposición de Magnesio (28 mg/L) y Electrolitos.'
    elif total_liters > 3.0:
        recommended_product_slug = 'eco-dispenser-20l'
        recommendation_reason = 'Tu alto volumen de hidratación diaria es ideal para el sistema Eco Dispenser 20L en hogar.'
    else:
        recommended_product_slug = 'manantial-puro-750ml'
        recommendation_reason = 'El equilibrio neutro de pH 7.8 de nuestro Manantial Puro es óptimo para tu ingesta diaria.'

    recommended_product = Product.objects.filter(slug=recommended_product_slug).first()

    return JsonResponse({
        'success': True,
        'weight': weight,
        'daily_liters': total_liters,
        'glasses_count': glasses_count,
        'recommendation_reason': recommendation_reason,
        'recommended_product': {
            'id': recommended_product.id if recommended_product else None,
            'name': recommended_product.name if recommended_product else 'AquaAura Manantial Puro',
            'price': float(recommended_product.price) if recommended_product else 2500,
            'slug': recommended_product.slug if recommended_product else 'manantial-puro-750ml',
            'container': recommended_product.container_type if recommended_product else 'Botella 750ml',
        }
    })


@csrf_exempt
def api_create_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)

    name = data.get('customer_name')
    email = data.get('customer_email')
    phone = data.get('customer_phone')
    address = data.get('delivery_address')
    items = data.get('items', [])
    order_type = data.get('order_type', 'one_time')
    total = data.get('total_amount', 0)

    if not name or not email or not phone or not address or not items:
        return JsonResponse({'error': 'Por favor completa todos los campos requeridos y añade productos al carrito.'}, status=400)

    order = Order.objects.create(
        customer_name=name,
        customer_email=email,
        customer_phone=phone,
        delivery_address=address,
        order_type=order_type,
        items_json=json.dumps(items),
        total_amount=total
    )

    return JsonResponse({
        'success': True,
        'order_number': str(order.order_number)[:8].upper(),
        'full_id': str(order.order_number),
        'customer_name': order.customer_name,
        'total': float(order.total_amount),
        'status': order.status,
        'status_display': order.get_status_display(),
        'message': '¡Tu pedido ha sido recibido e ingresado a nuestro sistema de embotellado!'
    })


@csrf_exempt
def api_contact(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON inválido'}, status=400)

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '')
    subject = data.get('subject', 'Consulta General')
    message = data.get('message')

    if not name or not email or not message:
        return JsonResponse({'error': 'Nombre, correo y mensaje son obligatorios.'}, status=400)

    ContactMessage.objects.create(
        name=name,
        email=email,
        phone=phone,
        subject=subject,
        message=message
    )

    return JsonResponse({
        'success': True,
        'message': '¡Gracias por contactarnos! Tu mensaje ha sido recibido por el equipo de AquaAura.'
    })
