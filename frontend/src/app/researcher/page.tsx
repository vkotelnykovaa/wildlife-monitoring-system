"use client";

import { Fragment, useEffect, useState } from "react";
import api from "@/services/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition/PageTransition";


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

type ActivityData = {
  animal_id: number;
  points_count: number;
  observation_days: number;
  total_distance_km: number;
  average_daily_distance_km: number;
  max_daily_distance_km: number;
  low_movement_days: number;
  activity_level: string;
  daily_distances: {
    date: string;
    distance_km: number;
  }[];
};


const AnimalMap = dynamic(() => import("@/components/AnimalMap"), {
  ssr: false,
});

export default function ResearcherPage() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [gpsData, setGpsData] = useState<GPSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activityData, setActivityData] = useState<ActivityData | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (!savedUser || !token) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(savedUser);

        if (user.role !== "researcher") {
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

   const handleViewGPS = async (animal: Animal) => {
  if (selectedAnimal?.id === animal.id) {
    setSelectedAnimal(null);
    setGpsData([]);
    setActivityData(null);
    return;
  }

  try {
    setSelectedAnimal(animal);

    const response = await api.get(`animals/${animal.id}/gps/`);
    setGpsData(response.data);

    const activityResponse = await api.get(`animals/${animal.id}/activity/`);
    setActivityData(activityResponse.data);
  } catch (error) {
    console.error(error);
    alert("Не вдалося завантажити GPS-дані");
  }
};

    const exportToJSON = () => {
        const dataStr = JSON.stringify(filteredGpsData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedAnimal?.name || "animal"}-gps-data.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        const headers = ["id", "animal", "latitude", "longitude", "timestamp"];

        const rows = filteredGpsData.map((point) => [
            point.id,
            point.animal,
            point.latitude,
            point.longitude,
            point.timestamp,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedAnimal?.name || "animal"}-gps-data.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const filteredGpsData = gpsData.filter((point) => {
        const pointDate = new Date(point.timestamp);

        if (dateFrom && pointDate < new Date(dateFrom)) {
            return false;
        }

        if (dateTo && pointDate > new Date(dateTo)) {
            return false;
        }

        return true;
    });

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

        router.push("/login");
    };

    const calculateDistance = (points: GPSData[]) => {
        if (points.length < 2) return 0;

        const toRad = (value: number) => (value * Math.PI) / 180;
        const earthRadius = 6371;

        let distance = 0;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const current = points[i];

            const dLat = toRad(current.latitude - prev.latitude);
            const dLon = toRad(current.longitude - prev.longitude);

            const lat1 = toRad(prev.latitude);
            const lat2 = toRad(current.latitude);

            const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            distance += earthRadius * c;
        }

        return distance;
    };

    const totalDistance = calculateDistance(filteredGpsData);

    const firstPointDate =
    filteredGpsData.length > 0
        ? new Date(filteredGpsData[0].timestamp).toLocaleString()
        : "—";

    const lastPointDate =
    filteredGpsData.length > 0
        ? new Date(filteredGpsData[filteredGpsData.length - 1].timestamp).toLocaleString()
        : "—";

return (
  <PageTransition>
    <main className="page">
      <section className="page-header">
        <div className="page-header-inner py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="page-badge">
                Research dashboard
              </div>

              <h1 className="page-title">
                Панель науковця
              </h1>

              <p className="page-subtitle">
                Аналіз телеметричних даних, GPS-маршрутів та активності тварин
                у реальному часі.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Вийти
              </button>
            </div>
          </div>

          <div className="dashboard-grid mt-10 md:grid-cols-3">
            <div className="stat-card">
              <p className="stat-label">
                Відстежуваних тварин
              </p>

              <h2 className="stat-value">
                {animals.length}
              </h2>
            </div>

            <div className="stat-card">
              <p className="stat-label">
                GPS-даних
              </p>

              <h2 className="stat-value">
                {gpsData.length}
              </h2>
            </div>

            <div className="stat-card">
              <p className="stat-label">
                Статус системи
              </p>

              <h2 className="stat-success">
                Active
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">
              Тварини
            </h2>

            <p className="section-subtitle">
              Повний доступ до маршрутів та телеметрії.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Завантаження...
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {animals.map((animal) => (
              <Fragment key={animal.id}>
              <div className="card card-hover">
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

                  <div className="eco-badge">
                    Research access
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleViewGPS(animal)}
                    className="btn-primary"
                  >
                    Аналіз GPS
                  </button>

                  <button
                    onClick={() => router.push(`/animals/${animal.id}`)}
                    className="btn-secondary"
                  >
                    Профіль
                  </button>
                </div>
                </div>
              {selectedAnimal?.id === animal.id && (
                <div className="gradient-card lg:col-span-2">
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        GPS analysis
                      </p>

                      <h2 className="section-title mt-2">
                        {selectedAnimal.name}
                      </h2>

                      <p className="section-subtitle">
                        Маршрут переміщення та телеметричні дані обраної тварини.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button onClick={exportToCSV} className="btn-secondary">
                        CSV
                      </button>

                      <button onClick={exportToJSON} className="btn-secondary">
                        JSON
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAnimal(null);
                          setGpsData([]);
                          setActivityData(null);
                        }}
                        className="btn-secondary"
                      >
                        Сховати
                      </button>
                    </div>
                  </div>

                  <div className="analytics-grid mb-6">
                    <div className="card-soft">
                      <p className="text-xs text-slate-500">GPS-точок</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        {filteredGpsData.length}
                      </p>
                    </div>

                    <div className="card-soft">
                      <p className="text-xs text-slate-500">Дистанція</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-950">
                        {totalDistance.toFixed(2)} км
                      </p>
                    </div>

                    <div className="card-soft">
                      <p className="text-xs text-slate-500">Перша точка</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">
                        {firstPointDate}
                      </p>
                    </div>

                    <div className="card-soft">
                      <p className="text-xs text-slate-500">Остання точка</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">
                        {lastPointDate}
                      </p>
                    </div>
                  </div>

                  {activityData && (
                    <div className="card-soft mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Аналіз активності
                      </p>

                      <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <div>
                          <p className="text-xs text-slate-500">Рівень активності</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {activityData.activity_level}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Середня дистанція / день</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {activityData.average_daily_distance_km} км
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Максимум за день</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {activityData.max_daily_distance_km} км
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Днів спостереження</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {activityData.observation_days}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-soft mb-6 flex flex-wrap items-end gap-3">
                    <label className="text-sm font-medium text-slate-600">
                      Від
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="input mt-2"
                      />
                    </label>

                    <label className="text-sm font-medium text-slate-600">
                      До
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="input mt-2"
                      />
                    </label>

                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                      }}
                      className="btn-secondary"
                    >
                      Очистити
                    </button>
                  </div>

                  {filteredGpsData.length === 0 ? (
                    <div className="empty-state">
                      GPS-даних для обраного періоду немає.
                    </div>
                  ) : (
                    <>
                      <div className="map-wrapper mb-6">
                        <AnimalMap points={filteredGpsData} />
                      </div>

                      <div className="table-wrapper">
                        <table className="w-full border-collapse text-sm">
                          <thead className="table-head">
                            <tr>
                              <th className="table-cell">Дата і час</th>
                              <th className="table-cell">Широта</th>
                              <th className="table-cell">Довгота</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredGpsData.map((point) => (
                              <tr key={point.id} className="table-row">
                                <td className="table-cell">
                                  {new Date(point.timestamp).toLocaleString()}
                                </td>
                                <td className="table-cell">{point.latitude}</td>
                                <td className="table-cell">{point.longitude}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>  
                  )}
                </div>
              )}
              </Fragment>
            ))}
          </div>
        )}
      </section>

                        
                      
    </main>
  </PageTransition>
);

};