// Pequenas helpers de navegação centralizadas (sem dependências externas)

export const MODULE_ROOTS: Record<string, string> = {
  marketplace: "/marketplace",
  work: "/work",
  wallet: "/wallet",
  dao: "/dao",
  profile: "/profile",
  search: "/search",
  dashboard: "/dashboard",
};

export function getModuleFromPath(pathname: string): keyof typeof MODULE_ROOTS | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return null;
  return (Object.keys(MODULE_ROOTS) as Array<keyof typeof MODULE_ROOTS>).includes(seg as any)
    ? (seg as keyof typeof MODULE_ROOTS)
    : null;
}

export function getModuleRootForPath(pathname: string): string {
  const mod = getModuleFromPath(pathname);
  return mod ? MODULE_ROOTS[mod] : "/";
}

export function isAtModuleRoot(pathname: string): boolean {
  const root = getModuleRootForPath(pathname);
  return pathname === "/" || pathname === root || pathname === "/dashboard";
}

export function pathToBreadcrumbs(pathname: string): Array<{ path: string; label: string }> {
  const segs = pathname.split("/").filter(Boolean);
  const labels: Record<string, string> = {
    marketplace: "Marketplace",
    digital: "Digitais",
    work: "Trabalho",
    wallet: "Wallet",
    dao: "DAO",
    profile: "Perfil",
    search: "Busca",
    settings: "Configurações",
  };
  const crumbs: Array<{ path: string; label: string }> = [];
  let acc = "";
  segs.forEach((s, i) => {
    acc += `/${s}`;
    const label = labels[s] ?? decodeURIComponent(s.replace(/-/g, " "));
    crumbs.push({ path: acc, label });
  });
  return crumbs;
}
