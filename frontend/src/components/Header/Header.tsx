"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  username: string;
  role: "admin" | "client" | "researcher";
};

const ADMIN_PANEL_URL = "http://127.0.0.1:8000/admin";

const getSavedUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const savedUser = window.localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    window.localStorage.removeItem("user");
    return null;
  }
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(() => getSavedUser());


  const isShopPage = pathname === "/shop";
  const isCartPage = pathname === "/cart";
  const isOrdersPage = pathname === "/orders";

  const showCart = isShopPage || isCartPage || isOrdersPage;
  const showOrders = isShopPage || isCartPage;

  useEffect(() => {

    const handleAuthChanged = () => {
      setUser(getSavedUser());
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
      return;
    }

    if (user.role === "client") {
      router.push("/user");
      return;
    }

    if (user.role === "admin") {
      window.location.href = ADMIN_PANEL_URL;
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
          <button onClick={() => router.push("/")} className="btn-secondary">
            Головна
          </button>

          <button onClick={() => router.push("/shop")} className="btn-secondary">
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

          {showOrders && (
            <button
              onClick={() => router.push("/orders")}
              className="btn-secondary"
            >
              Мої замовлення
            </button>
          )}

          {user ? (
            <>
              <button onClick={goToCabinet} className="btn-primary">
                Кабінет
              </button>

              <button onClick={handleLogout} className="btn-secondary">
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