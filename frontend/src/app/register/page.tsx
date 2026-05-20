"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const showAlert = (
    message: string,
    type: "error" | "success" = "error"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleRegister = async () => {
    setAlertMessage("");

    if (!email || !password) {
      showAlert("Будь ласка, заповніть усі поля.");
      return;
    }

    if (password.length < 6) {
      showAlert("Пароль повинен містити щонайменше 6 символів.");
      return;
    }

    try {
      await api.post("auth/register/", {
        email,
        password,
      });

      showAlert(
        "Реєстрація успішна. Зараз ви будете перенаправлені на сторінку входу.",
        "success"
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      showAlert(
        "Не вдалося зареєструватися. Можливо, користувач уже існує."
      );
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