"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition/PageTransition";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
};

const getSavedCart = (): Product[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem("cart");

  if (!savedCart) return [];

  try {
    const parsedCart: Product[] = JSON.parse(savedCart);

    return parsedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
  } catch {
    window.localStorage.removeItem("cart");
    return [];
  }
};

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>(() => getSavedCart());

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCart(updatedCart);
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Кошик порожній.");
      return;
    }

    if (!customerName || !customerEmail || !address) {
      alert("Будь ласка, заповніть усі поля для оформлення замовлення.");
      return;
    }

    try {
      await api.post("orders/create/", {
        customer_name: customerName,
        customer_email: customerEmail,
        address,
        total,
        items: cart,
      });

      localStorage.removeItem("cart");

      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
      setAddress("");

      router.push("/order-success");
    } catch (error) {
      console.error(error);
      alert("Не вдалося оформити замовлення");
    }
  };

  return (
    <PageTransition>
      <main className="page">
        <section className="page-header">
          <div className="page-header-inner">
            <div className="page-badge">Shopping cart</div>

            <h1 className="page-title">Кошик</h1>

            <p className="page-subtitle">
              Перегляд обраних товарів та оформлення замовлення.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="empty-state">Кошик порожній.</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="card card-hover">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="card-title">{item.name}</h2>

                      <p className="card-text">{item.description}</p>

                      <p className="mt-4 text-lg font-semibold text-slate-950">
                        {item.price} грн × {item.quantity}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-semibold text-slate-700 transition hover:bg-white"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm font-semibold text-slate-950">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-semibold text-slate-700 transition hover:bg-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn-secondary"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="checkout-card">
            <h2 className="section-title">Оформлення</h2>

            <div className="card-soft mt-6 p-5">
              <p className="stat-label">Загальна сума</p>

              <p className="stat-value">{total.toFixed(2)} грн</p>
            </div>

            <div className="form-grid mt-6">
              <input
                placeholder="Ваше ім’я"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input"
              />

              <input
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="input"
              />

              <textarea
                placeholder="Адреса доставки"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input min-h-28 resize-y"
              />

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`btn-primary w-full ${
                  cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Оформити замовлення
              </button>

              <button onClick={clearCart} className="btn-secondary w-full">
                Очистити кошик
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
