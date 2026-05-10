"use client";

import { useRouter } from "next/navigation";

export default function AdoptionSuccessPage() {
  const router = useRouter();



return (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
    <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-10 shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        🐾
      </div>

      <div className="mb-3 inline-flex border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Adoption completed
      </div>

      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
        Дякуємо за підтримку
      </h1>

      <p className="mt-5 text-sm leading-7 text-slate-500">
        Вашу заявку на символічне усиновлення тварини успішно збережено.
        Ваша підтримка допомагає розвитку системи моніторингу.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/")}
          className="btn-primary"
        >
          На головну
        </button>

        <button
          onClick={() => router.push("/shop")}
          className="btn-secondary"
        >
          Еко-магазин
        </button>
      </div>
    </section>
  </main>
);
};