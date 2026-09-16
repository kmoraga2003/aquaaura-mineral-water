import uuid
from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('still', 'Agua de Manantial Sin Gas'),
        ('sparkling', 'Agua de Manantial Con Gas'),
        ('infused', 'Agua Enriquecida Mineral'),
        ('eco', 'Bidones Eco Refill'),
    ]

    name = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    tagline = models.CharField(max_length=200, verbose_name="Eslogan")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='still', verbose_name="Categoría")
    volume_ml = models.IntegerField(default=750, verbose_name="Volumen (ml)")
    container_type = models.CharField(max_length=50, default='Botella Vidrio 750ml', verbose_name="Envase")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio ($)")
    
    # Mineral Profile
    ph_level = models.FloatField(default=7.8, verbose_name="Nivel pH")
    tds_mg_l = models.FloatField(default=180.0, verbose_name="Residuo Seco / TDS (mg/L)")
    calcium_mg_l = models.FloatField(default=45.0, verbose_name="Calcio Ca+ (mg/L)")
    magnesium_mg_l = models.FloatField(default=18.0, verbose_name="Magnesio Mg+ (mg/L)")
    potassium_mg_l = models.FloatField(default=4.5, verbose_name="Potasio K+ (mg/L)")
    silica_mg_l = models.FloatField(default=32.0, verbose_name="Sílice SiO2 (mg/L)")
    
    description = models.TextField(verbose_name="Descripción")
    badge = models.CharField(max_length=50, blank=True, null=True, verbose_name="Etiqueta Promocional")
    icon_type = models.CharField(max_length=30, default='still', verbose_name="Tipo de Ícono")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['id']

    def __str__(self):
        return f"{self.name} ({self.container_type})"


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre del Plan")
    slug = models.SlugField(unique=True)
    frequency_days = models.IntegerField(default=14, verbose_name="Frecuencia (días)")
    discount_percent = models.IntegerField(default=15, verbose_name="Descuento (%)")
    description = models.TextField(verbose_name="Descripción")
    icon_name = models.CharField(max_length=50, default='sparkles')

    class Meta:
        verbose_name = "Plan de Suscripción"
        verbose_name_plural = "Planes de Suscripción"

    def __str__(self):
        return f"{self.name} (-{self.discount_percent}%)"


class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('one_time', 'Compra Única'),
        ('subscription', 'Suscripción Periódica'),
    ]
    STATUS_CHOICES = [
        ('confirmed', 'Confirmado'),
        ('bottling', 'En Embotellado'),
        ('delivering', 'En Camino'),
        ('completed', 'Entregado'),
    ]

    order_number = models.CharField(max_length=36, unique=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=150, verbose_name="Nombre Cliente")
    customer_email = models.EmailField(verbose_name="Correo Electrónico")
    customer_phone = models.CharField(max_length=30, verbose_name="Teléfono")
    delivery_address = models.TextField(verbose_name="Dirección de Entrega")
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='one_time')
    items_json = models.TextField(verbose_name="Detalle del Carrito (JSON)")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total ($)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Pedido")

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-created_at']

    def __str__(self):
        return f"Pedido #{str(self.order_number)[:8]} - {self.customer_name}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre")
    email = models.EmailField(verbose_name="Correo Electrónico")
    phone = models.CharField(max_length=30, blank=True, null=True, verbose_name="Teléfono")
    subject = models.CharField(max_length=200, verbose_name="Asunto")
    message = models.TextField(verbose_name="Mensaje")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Mensaje de Contacto"
        verbose_name_plural = "Mensajes de Contacto"
        ordering = ['-created_at']

    def __str__(self):
        return f"Mensaje de {self.name} - {self.subject}"
