"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  product_name: string;
};

type Order = {
  id: number;
  total: string;
  created_at: string;
  items: OrderItem[];
};
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/my/");
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

return (
     <PageTransition>
    <main className="page">
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-3 inline-flex border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
          Order history
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Мої замовлення
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Історія ваших замовлень в еко-магазині.
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-10">
      {orders.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          У вас поки немає замовлень.
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    Замовлення #{order.id}
                  </div>

                  <p className="text-sm text-slate-500">
                    Дата: {new Date(order.created_at).toLocaleString()}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {order.total} грн
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  Збережено
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-950">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Кількість: {item.quantity || 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  </main>
  </PageTransition>
);
};