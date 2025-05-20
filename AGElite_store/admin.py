from django.contrib import admin
from .models import Category, Product, Order, OrderItem, ProductSpecification


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ["name"]}


class ProductSpecificationInline(admin.StackedInline):
    model = ProductSpecification
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "available"]
    list_filter = ["available", "category"]
    prepopulated_fields = {"slug": ["name"]}
    inlines = [ProductSpecificationInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "paid", "created"]
    inlines = [OrderItemInline]
