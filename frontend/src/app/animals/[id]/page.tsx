"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import PageTransition from "@/components/PageTransition/PageTransition";

type Animal = {
  id: number;
  name: string;
  species: string;
  collar_id?: string;
};

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [adoptionName, setAdoptionName] = useState("");
  const [adoptionEmail, setAdoptionEmail] = useState("");
  const [donationAmount, setDonationAmount] = useState("100");
  const [message, setMessage] = useState("");
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {

    const fetchAnimal = async () => {
      try {
        const response = await api.get(`animals/${params.id}/`);
        setAnimal(response.data);
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserRole(user.role);
          }
      } catch (error) {
        console.error(error);
        alert("Не вдалося завантажити профіль тварини");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [params.id]);

  if (loading) {
    return <p style={{ padding: "32px" }}>Завантаження...</p>;
  }

  if (!animal) {
    return <p style={{ padding: "32px" }}>Тварину не знайдено.</p>;
  }


    const handleAdoption = async () => {
    try {
      await api.post("adoptions/create/", {
        animal: animal?.id,
        name: adoptionName,
        email: adoptionEmail,
        donation_amount: donationAmount,
        message,
      });

      router.push("/adoption-success");

      setAdoptionName("");
      setAdoptionEmail("");
      setDonationAmount("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Не вдалося створити заявку");
    }
      setShowAdoptionForm(false);
  };


return (
   <PageTransition>
  <main className="page px-6 py-10">
    <section className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[0.9fr_1.4fr]">
      <div className="card p-6">
        <div className="hero-gradient flex h-72 items-center justify-center rounded-lg text-7xl">
          🐾
        </div>
      </div>

      <div className="card p-8">
        <div className="page-badge">
          Animal profile
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {animal.name}
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          {animal.species}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="card-soft">
            <p className="text-xs text-slate-500">GPS-нашийник</p>
            <p className="mt-2 font-semibold text-slate-950">
              {animal.collar_id || "Не підключено"}
            </p>
          </div>

          <div className="card-soft">
            <p className="text-xs text-slate-500">Статус</p>
            <p className="mt-2 font-semibold text-emerald-600">
              Активне спостереження
            </p>
          </div>

          <div className="card-soft">
            <p className="text-xs text-slate-500">Регіон</p>
            <p className="mt-2 font-semibold text-slate-950">
              Причорноморський степ
            </p>
          </div>
        </div>

        {userRole !== "researcher" && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            {!showAdoptionForm ? (
              <button
                className="btn-primary"
                onClick={() => setShowAdoptionForm(true)}
              >
                Усиновити тварину
              </button>
            ) : (
              <div className="card-soft p-5">
                <h2 className="card-title">
                  Символічне усиновлення
                </h2>

                <p className="card-text">
                  Оберіть щомісячну суму підтримки. Ваш внесок допоможе покривати
                  витрати на GPS-нашийники та моніторинг тварин.
                </p>

                <div className="mt-5 space-y-3">
                  <input
                    placeholder="Ваше ім’я"
                    value={adoptionName}
                    onChange={(e) => setAdoptionName(e.target.value)}
                    className="input"
                  />

                  <input
                    placeholder="Email"
                    value={adoptionEmail}
                    onChange={(e) => setAdoptionEmail(e.target.value)}
                    className="input"
                  />

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-600">
                      Сума щомісячної підтримки
                    </p>

                    <div className="grid gap-2 sm:grid-cols-3">
                      {["100", "500", "1000"].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDonationAmount(amount)}
                          className={
                            donationAmount === amount
                              ? "btn-primary"
                              : "btn-secondary"
                          }
                        >
                          {amount} грн / місяць
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    placeholder="Повідомлення"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input min-h-28 resize-y"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button className="btn-primary" onClick={handleAdoption}>
                      Підтвердити
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => setShowAdoptionForm(false)}
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>

    <section className="card mx-auto mt-6 max-w-6xl p-8">
      <h2 className="section-title">
        Інформація
      </h2>

      <p className="card-text">
        Тварина перебуває під моніторингом системи. GPS-нашийник використовується
        для збору даних про переміщення, активність та поведінку у природному
        середовищі.
      </p>

      <p className="card-text">
        Дані використовуються для наукових досліджень, аналізу міграцій та
        захисту популяції.
      </p>
    </section>
  </main>
  </PageTransition>
);
};