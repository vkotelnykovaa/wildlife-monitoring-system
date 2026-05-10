"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("auth/login/", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("authChanged"));

      const user = response.data.user;

      if (user.role === "researcher") {
        router.push("/researcher");
      } else if (user.role === "admin") {
        window.location.href = "http://127.0.0.1:8000/admin";
      } else {
        router.push("/user");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка входу. Перевірте email та пароль.");
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
              Вхід до системи
            </h1>

            <p className="section-subtitle mt-4">
              Увійдіть, щоб отримати доступ до функцій системи відповідно до вашої ролі.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="section-title mb-6">
              Авторизація
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
                onClick={handleLogin}
                className="btn-primary w-full"
              >
                Увійти
              </button>

              <button
                onClick={() => router.push("/register")}
                className="btn-secondary w-full"
              >
                Створити обліковий запис
              </button>
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}