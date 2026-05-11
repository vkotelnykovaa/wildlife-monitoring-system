"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition/PageTransition";

const AnimalMap = dynamic(() => import("@/components/AnimalMap"), {
  ssr: false,
});

type Animal = {
  id: number;
  name: string;
  species: string;
  collar_id?: string;
};

type GPSData = {
  id: number;
  animal: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export default function UserPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [gpsData, setGpsData] = useState<GPSData[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "client") {
      router.push("/");
      return;
    }

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

    fetchAnimals();
  }, [router]);

  const handleViewMap = async (animal: Animal) => {
    try {
      setSelectedAnimal(animal);

      const response = await api.get(`animals/${animal.id}/gps/`);
      setGpsData(response.data);
    } catch (error) {
      console.error(error);
      alert("Не вдалося завантажити GPS-дані");
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете вийти із системи?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <PageTransition>
      <main className="page">
        <section className="page-header">
          <div className="page-header-inner py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="page-badge">User dashboard</div>

                <h1 className="page-title">Кабінет користувача</h1>

                <p className="page-subtitle">
                  Перегляд тварин та їх переміщень за попередній місяць.
                  Повні GPS-дані обмежені з міркувань безпеки тварин.
                </p>
              </div>

              <button onClick={handleLogout} className="btn-secondary">
                Вийти
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="sidebar-card">
            <h2 className="section-title">Тварини</h2>

            <p className="section-subtitle">
              Оберіть тварину, щоб переглянути доступну карту.
            </p>

           <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <div className="empty-state">Завантаження...</div>
              ) : animals.length === 0 ? (
                <div className="empty-state">Тварин поки немає.</div>
              ) : (
                animals.map((animal) => (
                  <div
                    key={animal.id}
                    className="card card-hover flex h-full flex-col p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          {animal.name}
                        </h3>

                        <p className="card-text mt-1">{animal.species}</p>

                        {animal.collar_id && (
                          <p className="mt-2 text-xs text-slate-400">
                            Collar ID: {animal.collar_id}
                          </p>
                        )}
                      </div>

                      <span className="eco-badge">30 days</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewMap(animal)}
                        className="btn-primary"
                      >
                        Карта
                      </button>

                      <button
                        onClick={() => router.push(`/animals/${animal.id}`)}
                        className="btn-secondary"
                      >
                        Профіль
                      </button>
                    </div>

                    {selectedAnimal?.id === animal.id && (
                      <div className="mt-6">
                        <div className="card-soft mb-4">
                          <p className="text-xs uppercase tracking-wide text-slate-500">
                            Карта переміщень
                          </p>

                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {animal.name}
                          </p>
                        </div>

                        {gpsData.length === 0 ? (
                          <div className="empty-state ">
                            Даних для тварини {animal.name} поки немає.
                          </div>
                        ) : (
                          <div className="map-wrapper w-full">
                            <AnimalMap points={gpsData} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}