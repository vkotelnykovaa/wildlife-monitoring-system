"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const showAlert = (message: string, type: "error" | "success" = "error") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleLogin = async () => {
    setAlertMessage("");

    if (!email || !password) {
      showAlert("Заповніть email та пароль.");
      return;
    }

    try {
      const response = await api.post("auth/login/", {
        email,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("authChanged"));

      showAlert("Вхід виконано успішно.", "success");

      const user = response.data.user;

      setTimeout(() => {
        if (user.role === "researcher") {
          router.push("/researcher");
        } else if (user.role === "admin") {
          window.location.href = "http://127.0.0.1:8000/admin";
        } else {
          router.push("/user");
        }
      }, 600);
    } catch (error) {
      console.error(error);
      showAlert("Не вдалося увійти. Перевірте email та пароль.");
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

            <h1 className="page-title">Вхід до системи</h1>

            <p className="section-subtitle mt-4">
              Увійдіть, щоб отримати доступ до функцій системи відповідно до вашої ролі.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="section-title mb-6">Авторизація</h2>

            {alertMessage && (
              <div
                className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                  alertType === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {alertMessage}
              </div>
            )}

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

              <button onClick={handleLogin} className="btn-primary w-full">
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