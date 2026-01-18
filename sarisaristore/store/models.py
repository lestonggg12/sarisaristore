# sarisaristore/store/models.py
from django.db import models
from django.contrib.auth.models import User

class StoreSettings(models.Model):
    """
    Stores global configuration for the shop.
    Singleton pattern ensures only one record (ID=1) exists.
    """
    profit_margin = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    low_stock_limit = models.IntegerField(default=5)
    theme = models.CharField(max_length=10, default='light')

    def save(self, *args, **kwargs):
        self.pk = 1  # Force overwrite of the first record
        super(StoreSettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Global Store Settings"

    class Meta:
        verbose_name_plural = "Store Settings"

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('bath', 'Bath, Hygiene & Laundry Soaps'),
        ('foods', 'Whole Foods'),
        ('beverages', 'Beverages'),
        ('wholesale_beverages', 'Wholesale Beverages'),
        ('school', 'School Supplies'),
        ('liquor', 'Hard Liquors'),
        ('snacks', 'Snacks'),
    ]
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
    
    class Meta:
        ordering = ['category', 'name']

class Sale(models.Model):
    PAYMENT_CHOICES = [('cash', 'Cash'), ('credit', 'Credit')]
    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-date']

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Debtor(models.Model):
    name = models.CharField(max_length=200)
    contact = models.CharField(max_length=100, blank=True)
    total_debt = models.DecimalField(max_digits=10, decimal_places=2)
    date_borrowed = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)
    date_paid = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['paid', '-date_borrowed']

class DebtorItem(models.Model):
    debtor = models.ForeignKey(Debtor, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)