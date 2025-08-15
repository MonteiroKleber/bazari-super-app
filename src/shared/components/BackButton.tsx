import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getModuleRootForPath, isAtModuleRoot } from "../../app/navigation/navUtils";

export default function BackButton({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const nav = useNavigate();
  const loc = useLocation();

  // Evita mostrar no root do módulo ou no dashboard
  if (isAtModuleRoot(loc.pathname)) return null;

  const canGoBack =
    typeof window !== "undefined" &&
    window.history &&
    // React Router v6 popula history.state.idx
    (window.history.state?.idx ?? 0) > 0;

  const goBack = () => {
    if (canGoBack) {
      nav(-1);
    } else {
      nav(getModuleRootForPath(loc.pathname), { replace: true });
    }
  };

  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 ${className}`}
      aria-label="Voltar"
    >
      {/* Use um ícone do seu set se quiser; texto é seguro se o ícone faltar */}
      <span aria-hidden>←</span>
      {children ?? "Voltar"}
    </button>
  );
}
