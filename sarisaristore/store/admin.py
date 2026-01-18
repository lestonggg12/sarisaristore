# store/admin.py
from django.contrib import admin
from .models import Product, Sale, SaleItem, Debtor, DebtorItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'cost', 'price', 'quantity', 'profit')
    list_filter = ('category',)
    search_fields = ('name',)
    
    def profit(self, obj):
        return f"₱{obj.price - obj.cost:.2f}"
    profit.short_description = 'Profit per Unit'

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'total', 'payment_method', 'user')
    list_filter = ('payment_method', 'date')
    inlines = [SaleItemInline]

class DebtorItemInline(admin.TabularInline):
    model = DebtorItem
    extra = 0

@admin.register(Debtor)
class DebtorAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact', 'total_debt', 'paid', 'date_borrowed')
    list_filter = ('paid',)
    search_fields = ('name', 'contact')
    inlines = [DebtorItemInline]

    from django.contrib import admin
from .models import StoreSettings

@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    # Only allow one instance to be created
    def has_add_permission(self, request):
        return not StoreSettings.objects.exists()