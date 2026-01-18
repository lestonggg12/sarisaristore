# sarisaristore/store/views.py
# sarisaristore/store/views.py
from django.core.cache import cache  # ✅ Keep this one
# from linecache import cache  # ❌ DELETE THIS LINE
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Product, Sale, SaleItem, Debtor, DebtorItem, StoreSettings
from .serializers import ProductSerializer, SaleSerializer, DebtorSerializer


# --- AUTH VIEWS ---
def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        access_code = request.POST.get('access_code')
        user = authenticate(request, username=username, password=password)
        if user is not None and access_code == "123456":
            auth_login(request, user)
            return redirect('dashboard')
        messages.error(request, "Invalid credentials or access code.")
    return render(request, 'admin_login.html')

def logout_view(request):
    auth_logout(request)
    return redirect('login')

@login_required(login_url='login')
def dashboard_view(request):
    return render(request, 'dashboard.html')

# --- SETTINGS API ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_settings(request):
    settings = StoreSettings.load()
    return JsonResponse({
        'profitMargin': float(settings.profit_margin),
        'lowStockLimit': settings.low_stock_limit,
        'theme': settings.theme,
    })

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_settings(request):
    try:
        data = json.loads(request.body)
        settings = StoreSettings.load()
        settings.profit_margin = data.get('profitMargin', settings.profit_margin)
        settings.low_stock_limit = data.get('lowStockLimit', settings.low_stock_limit)
        settings.theme = data.get('theme', settings.theme)
        settings.save()
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

# --- PRODUCT API ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)

# --- SALE API ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sale_list(request):
    if request.method == 'GET':
        sales = Sale.objects.all().order_by('-date')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def sale_clear_all(request):
    """Clear all sales records"""
    Sale.objects.all().delete()
    return Response({'message': 'All sales cleared'}, status=status.HTTP_200_OK)

# --- DEBTOR API ---
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def debtor_list(request):
    if request.method == 'GET':
        debtors = Debtor.objects.all()
        serializer = DebtorSerializer(debtors, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DebtorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def debtor_detail(request, pk):
    try:
        debtor = Debtor.objects.get(pk=pk)
    except Debtor.DoesNotExist:
        return Response({'error': 'Debtor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = DebtorSerializer(debtor)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = DebtorSerializer(debtor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        debtor.delete()
        return Response({'message': 'Debtor deleted'}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST'])
def accumulated_totals(request):
    """Get or update accumulated revenue and profit"""
    if request.method == 'GET':
        # Get from database or cache
        revenue = cache.get('accumulated_revenue', 0.0)
        profit = cache.get('accumulated_profit', 0.0)
        last_cleared = cache.get('last_cleared', None)
        
        return Response({
            'accumulated_revenue': float(revenue),
            'accumulated_profit': float(profit),
            'last_cleared': last_cleared
        })
    
    elif request.method == 'POST':
        # Update accumulated totals
        revenue = float(request.data.get('accumulated_revenue', 0))
        profit = float(request.data.get('accumulated_profit', 0))
        
        # Store in cache
        cache.set('accumulated_revenue', revenue, None)
        cache.set('accumulated_profit', profit, None)
        cache.set('last_cleared', request.data.get('last_cleared'))
        
        return Response({
            'accumulated_revenue': revenue,
            'accumulated_profit': profit
        })