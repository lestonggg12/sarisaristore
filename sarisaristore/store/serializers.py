# sarisaristore/store/serializers.py
from rest_framework import serializers
from .models import Product, Sale, SaleItem, Debtor, DebtorItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Sale
        fields = ['id', 'date', 'total', 'profit', 'payment_method', 'user', 'items']

class DebtorItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = DebtorItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class DebtorSerializer(serializers.ModelSerializer):
    items = DebtorItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Debtor
        fields = ['id', 'name', 'contact', 'total_debt', 'date_borrowed', 'paid', 'date_paid', 'items']