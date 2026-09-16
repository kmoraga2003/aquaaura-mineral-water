from django.urls import path
from water_app import views

app_name = 'water_app'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('api/hydration-calc/', views.api_calculate_hydration, name='api_hydration_calc'),
    path('api/order/', views.api_create_order, name='api_create_order'),
    path('api/contact/', views.api_contact, name='api_contact'),
]
