"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("auth/register/", {
        email,
        password,
      });

      alert("Реєстрація успішна. Тепер увійдіть у систему.");

      router.push("/login");
    } catch (error) {
      console.error(error);

      alert("Помилка реєстрації. Перевірте введені дані.");
    }
  };

  return (
    <PageTransition>
      <main className="page px-6 py-16">
        <section className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              WildlifeTrack
            </p>

            <h1 className="page-title">
              Створення акаунта
            </h1>

            <p className="section-subtitle mt-4">
              Зареєструйтесь, щоб отримати доступ до карти,
              профілів тварин та програми підтримки.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="section-title mb-6">
              Реєстрація
            </h2>

            <div className="form-grid">
              <input
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />

              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />

              <button
                onClick={handleRegister}
                className="btn-primary w-full"
              >
                Зареєструватися
              </button>

              <button
                onClick={() => router.push("/login")}
                className="btn-secondary w-full"
              >
                Уже маю акаунт
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}