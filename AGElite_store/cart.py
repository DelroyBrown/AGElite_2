from decimal import Decimal
from django.conf import settings
from .models import Product


class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get("cart")
        if not cart:
            cart = self.session["cart"] = {}
        self.cart = cart

    def add(self, product, quantity=1, update_quantity=False):
        pid = str(product.id)
        if pid not in self.cart:
            self.cart[pid] = {"quantity": 0, "price": str(product.price)}
        if update_quantity:
            self.cart[pid]["quantity"] = quantity
        else:
            self.cart[pid]["quantity"] += quantity
        self.save()

    def save(self):
        self.session.modified = True

    def remove(self, product):
        pid = str(product.id)
        if pid in self.cart:
            del self.cart[pid]
            self.save()

    def __iter__(self):
        pids = self.cart.keys()
        products = Product.objects.filter(id__in=pids)
        for product in products:
            item = self.cart[str(product.id)]
            item["product"] = product
            item["total_price"] = Decimal(item["price"]) * item["quantity"]
            yield item

    def __len__(self):
        return sum(item["quantity"] for item in self.cart.values())

    def get_total_price(self):
        return sum(
            Decimal(item["price"]) * item["quantity"] for item in self.cart.values()
        )

    def clear(self):
        del self.session["cart"]
        self.save()
