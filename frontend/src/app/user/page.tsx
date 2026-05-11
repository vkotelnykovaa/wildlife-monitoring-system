"use client";

import { Fragment, useEffect, useState } from "react";
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

  {animals.map((animal, index) => {
  const isSelected = selectedAnimal?.id === animal.id;
  const isEndOfRowDesktop = (index + 1) % 3 === 0;
  const isEndOfRowTablet = (index + 1) % 2 === 0;
  const isLastAnimal = index === animals.length - 1;

  const shouldShowMapAfterThisAnimal =
    isSelected ||
    (selectedAnimal &&
      animals.findIndex((item) => item.id === selectedAnimal.id) <= index &&
      (isEndOfRowDesktop || isLastAnimal));

  return (
    <>
      <div
        key={animal.id}
        className="card card-hover flex h-full flex-col p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-950">{animal.name}</h3>

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
          <button onClick={() => handleViewMap(animal)} className="btn-primary">
            Карта
          </button>

          <button
            onClick={() => router.push(`/animals/${animal.id}`)}
            className="btn-secondary"
          >
            Профіль
          </button>
        </div>
      </div>

      {shouldShowMapAfterThisAnimal && (
        <div className="col-span-full mt-4">
          <div className="card-soft mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Карта переміщень
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-950">
              {selectedAnimal.name}
            </p>
          </div>

          {gpsData.length === 0 ? (
            <div className="empty-state">
              Даних для тварини {selectedAnimal.name} поки немає.
            </div>
          ) : (
            <div className="map-wrapper">
              <AnimalMap points={gpsData} />
            </div>
          )}
        </div>
      )}
    </>
  );
})}}