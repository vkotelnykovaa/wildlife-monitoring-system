"use client";

import PageTransition from "@/components/PageTransition/PageTransition";
import Card from "@/components/ui/Card";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Футболка з картою переміщень",
    price: 650,
    description: "Сувенірна футболка з візуалізацією маршруту тварини.",
  },
  {
    id: 2,
    name: "Еко-шопер",
    price: 350,
    description: "Багаторазова сумка з тематичним дизайном.",
  },
  {
    id: 3,
    name: "Наліпки Wildlife Monitoring",
    price: 120,
    description: "Набір наліпок із тваринами Причорноморського степу.",
  },
];

export default function ShopPage() {
  const [notification, setNotification] = useState("");

  const handleAddToCart = (product: Product) => {
    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setNotification("Товар додано в кошик");

    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  return (
    <PageTransition>
      <main className="page">
        {notification && (
          <div className="fixed right-6 top-24 z-50 rounded-lg border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold text-emerald-700 shadow-xl shadow-emerald-100">
            {notification}
          </div>
        )}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-3 inline-flex border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
              Eco store
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Еко-магазин
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Тематичні товари допомагають підтримувати проєкт моніторингу тварин
              та розвиток системи.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="hover:-translate-y-1">
                <div className="mb-5 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-slate-100 text-5xl">
                  🌿
                </div>

                <h2 className="text-xl font-semibold text-slate-950">
                  {product.name}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                  {product.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <p className="text-xl font-semibold text-slate-950">
                    {product.price} грн
                  </p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary"
                  >
                    У кошик
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}