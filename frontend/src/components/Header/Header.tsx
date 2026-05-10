"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";


type User = {
  id: number;
  email: string;
  username: string;
  role: string;
};

export default function Header() {
  const router = useRouter();

const [user, setUser] = useState<User | null>(null);
const pathname = usePathname();
const showCart = pathname === "/shop" || pathname === "/cart";

  useEffect(() => {

  const savedUser = localStorage.getItem("user");
  setUser(savedUser ? JSON.parse(savedUser) : null);

  const handleAuthChanged = () => {
    const updatedUser = localStorage.getItem("user");
    setUser(updatedUser ? JSON.parse(updatedUser) : null);
  };

  window.addEventListener("authChanged", handleAuthChanged);

  return () => {
    window.removeEventListener("authChanged", handleAuthChanged);
  };
}, []);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете вийти із системи?"
    );

    if (!confirmed) return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    window.dispatchEvent(new Event("authChanged"));

    router.push("/");
  };

  const goToCabinet = () => {
    if (!user) return;

    if (user.role === "researcher") {
      router.push("/researcher");
    } else if (user.role === "client") {
      router.push("/user");
    } else if (user.role === "admin") {
      window.location.href = "http://127.0.0.1:8000/admin";
    }
  };



 return (
  <header className="page-header sticky top-0 z-50">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 transition-all duration-300">
      <button
        onClick={() => router.push("/")}
        className="text-base font-bold tracking-tight text-slate-950 transition hover:text-emerald-600"
      >
        Wildlife<span className="text-emerald-600">Track</span>
      </button>

      <nav className="flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="btn-secondary"
        >
          Головна
        </button>

        <button
          onClick={() => router.push("/shop")}
          className="btn-secondary"
        >
          Еко-магазин
        </button>

        {showCart && (
          <button
            onClick={() => router.push("/cart")}
            className="btn-secondary"
          >
            Кошик
          </button>
        )}

        <button
          onClick={() => router.push("/orders")}
          className="btn-secondary"
        >
          Мої замовлення
        </button>

        {user ? (
          <>
            <button
              onClick={goToCabinet}
              className="btn-primary"
            >
              Кабінет
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="btn-secondary"
            >
              Вхід
            </button>

            <button
              onClick={() => router.push("/register")}
              className="btn-primary"
            >
              Реєстрація
            </button>
          </>
        )}
      </nav>
    </div>
  </header>
);
}