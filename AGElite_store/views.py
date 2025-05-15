from django.shortcuts import render, get_object_or_404, redirect
from .models import Category, Product, Order, OrderItem
from .forms import CartAddProductForm, OrderCreateForm
from .cart import Cart


def home(request):
    # Fetch all categories and a few featured products
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)[:4]  # Only show first 4 products
    return render(
        request, "store/home.html", {"categories": categories, "products": products}
    )


# Product listing by category
def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    return render(
        request,
        "store/product_list.html",
        {"category": category, "categories": categories, "products": products},
    )


# Product detail
def product_detail(request, id, slug):
    product = get_object_or_404(Product, id=id, slug=slug, available=True)
    cart_product_form = CartAddProductForm()
    return render(
        request,
        "store/product_detail.html",
        {"product": product, "cart_product_form": cart_product_form},
    )


# Add/Remove from cart
def cart_add(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    form = CartAddProductForm(request.POST)
    if form.is_valid():
        cd = form.cleaned_data
        cart.add(product=product, quantity=cd["quantity"], update_quantity=cd["update"])


def cart_remove(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return redirect("cart_detail")


# Cart detail view
def cart_detail(request):
    cart = Cart(request)
    return render(request, "cart/cart_detail.html", {"cart": cart})


# Order creation
def order_create(request):
    cart = Cart(request)
    if request.method == "POST":
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            if request.user.is_authenticated:
                order.user = request.user
            order.save()
            for item in cart:
                OrderItem.objects.create(
                    order=order, product=item["product"], quantity=item["quantity"]
                )
            cart.clear()
            return render(request, "cart/order_create.html", {"order": order})
    else:
        form = OrderCreateForm()
    return render(request, "cart/order_create.html", {"cart": cart, "form": form})
