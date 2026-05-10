"use client";

import PageTransition from "@/components/PageTransition/PageTransition";
import Card from "@/components/ui/Card";

const products = [
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

const handleAddToCart = (product: any) => {
  const existingCart = localStorage.getItem("cart");
  const cart = existingCart ? JSON.parse(existingCart) : [];

  const existingProduct = cart.find((item: any) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Товар додано в кошик");
};



export default function ShopPage() {
  return (
     <PageTransition>
  <main className="page">
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
          <Card 
            key={product.id}
            className="hover:-translate-y-1">
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
};