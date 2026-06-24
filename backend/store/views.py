from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    RegisterSerializer,
    UserSerializer
)

# ---------------- PRODUCTS ----------------

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# ---------------- CART ----------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data)


# ✅ FIXED ADD TO CART (IMPORTANT)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        cart, created = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            item.quantity += 1
            item.save()

        return Response({
            'message': 'Product added successfully'
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    try:
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity'))

        item = CartItem.objects.get(id=item_id)

        if quantity < 1:
            item.delete()
            return Response({'message': 'Item removed'})

        item.quantity = quantity
        item.save()

        return Response({'message': 'Updated successfully'})

    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    try:
        item_id = request.data.get('item_id')
        CartItem.objects.filter(id=item_id).delete()
        return Response({'message': 'Removed successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ---------------- ORDER ----------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        cart = Cart.objects.get(user=request.user)

        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)

        name = request.data.get("name")
        address = request.data.get("address")
        phone = request.data.get("phone")
        payment_method = request.data.get("payment_method")

        if not name or not address or not phone:
            return Response({'error': 'All fields are required'}, status=400)

        if len(phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)

        total = sum([item.subtotal for item in cart.items.all()])

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            name=name,
            address=address,
            phone=phone,
            payment_method=payment_method
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart.items.all().delete()

        return Response({
            'message': 'Order placed successfully',
            'order_id': order.id
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ---------------- AUTH ----------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User created",
            "user": UserSerializer(user).data
        })
    return Response(serializer.errors, status=400)


# ---------------- PROFILE ----------------

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            "username": user.username,
            "email": user.email,
            "phone": profile.phone,
            "address": profile.address,
            "profile_image": profile.profile_image.url if profile.profile_image else None
        })

    elif request.method == 'PUT':
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.save()

        profile.phone = request.data.get('phone', '')
        profile.address = request.data.get('address', '')

        if request.FILES.get('profile_image'):
            profile.profile_image = request.FILES.get('profile_image')

        profile.save()

        return Response({"message": "Profile updated successfully"})
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)