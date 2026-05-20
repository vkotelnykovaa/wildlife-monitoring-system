"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { motion } from "framer-motion";

type Animal = {
  id: number;
  name: string;
  species: string;
};

export default function HomePage() {
  const router = useRouter();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access");
      setIsLoggedIn(!!token);
    };

    const fetchAnimals = async () => {
      try {
        const response = await api.get("animals/");
        setAnimals(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchAnimals();

    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return (
    <main className="page">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="page-header"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="page-badge">
              Wildlife Monitoring System
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-slate-950">
              Моніторинг активності тварин у реальному часі
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Інформаційна система для дослідження переміщень тварин
              Причорноморського степу з використанням GPS-нашийників
              та телеметричних даних.
            </p>

            {!isLoggedIn && (
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/register")}
                  className="btn-primary"
                >
                  Розпочати
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="btn-secondary"
                >
                  Увійти
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="stat-label">
                    Активних тварин
                  </p>

                  <h2 className="stat-value">
                    {animals.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                GPS-моніторинг
              </h3>

              <p className="card-text">
                Науковці можуть аналізувати маршрути переміщення,
                переглядати телеметричні дані та експортувати результати досліджень.
              </p>
            </div>

            <div className="card">
              <h3 className="card-title">
                Безпечний доступ
              </h3>

              <p className="card-text">
                Різні ролі користувачів мають різні рівні доступу до GPS-даних.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="page-section">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">
              Тварини системи
            </h2>

            <p className="section-subtitle">
              Гість може переглядати лише базову інформацію.
            </p>
          </div>

          <div className="neutral-badge px-4 py-2 text-sm">
            {animals.length} записів
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Завантаження...
          </div>
        ) : (
          <div className="dashboard-grid">
            {animals.map((animal) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => router.push(`/animals/${animal.id}`)}
                className="card card-hover group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="icon-box mb-4">
                      🐾
                    </div>

                    <h3 className="card-title">
                      {animal.name}
                    </h3>

                    <p className="card-text">
                      {animal.species}
                    </p>
                  </div>

                  <div className="neutral-badge">
                    Public
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium text-slate-700">
                    Переглянути профіль
                  </span>

                  <span className="hover-link text-slate-400">
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}