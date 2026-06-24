from django.contrib import admin
from .models import Category, Product, UserProfile, Order, OrderItem


# ================= CATEGORY =================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


# ================= PRODUCT =================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category']


# ================= USER PROFILE =================
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone']


# ================= ORDER ITEM INLINE =================
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']


# ================= ORDER ADMIN (🔥 FINAL VERSION) =================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = [
        'id',
        'user',
        'name',
        'phone',
        'payment_method',
        'status',          
        'total_amount',
        'get_products',
        'created_at'
    ]

    list_filter = ['status', 'payment_method', 'created_at']

    inlines = [OrderItemInline]

    #  SHOW PRODUCT NAMES
    def get_products(self, obj):
        items = obj.items.all()
        return ", ".join([item.product.name for item in items])

    get_products.short_description = "Products"

    #  BULK ACTIONS
    actions = ['mark_as_shipped', 'mark_as_delivered']

    def mark_as_shipped(self, request, queryset):
        queryset.update(status='SHIPPED')
    mark_as_shipped.short_description = "Mark selected orders as Shipped"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status='DELIVERED')
    mark_as_delivered.short_description = "Mark selected orders as Delivered"


# ================= ORDER ITEM =================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price']