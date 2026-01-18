# sarisaristore/store/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Auth & Dashboard
    path('', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
    
    path('api/accumulated-totals/', views.accumulated_totals, name='accumulated-totals'),

    # Product API
    path('api/products/', views.product_list, name='product-list'),
    path('api/products/<int:pk>/', views.product_detail, name='product-detail'),
    
    # Sales API
    path('api/sales/', views.sale_list, name='sale-list'),
    path('api/sales/clear/', views.sale_clear_all, name='sale-clear'),
    
    # Debtor API
    path('api/debtors/', views.debtor_list, name='debtor-list'),
    path('api/debtors/<int:pk>/', views.debtor_detail, name='debtor-detail'),

    # Settings API
    path('api/get-settings/', views.get_settings, name='get-settings'),
    path('api/save-settings/', views.save_settings, name='save-settings'),
]