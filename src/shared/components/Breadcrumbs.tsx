import { Link, useLocation } from "react-router-dom";
import { pathToBreadcrumbs, isAtModuleRoot } from "../../app/navigation/navUtils";

export default function Breadcrumbs({ className = "" }: { className?: string }) {
  const { pathname } = useLocation();
  if (isAtModuleRoot(pathname)) return null;

  const crumbs = pathToBreadcrumbs(pathname);
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="breadcrumb" className={`text-sm text-muted-foreground ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </li>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              <span className="opacity-50">/</span>
              {isLast ? (
                <span className="font-medium text-foreground">{c.label}</span>
              ) : (
                <Link to={c.path} className="hover:underline">{c.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
