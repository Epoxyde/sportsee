import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { SportSeeLogo } from "./SportSeeLogo";

export function SiteHeader({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <header className={`sportsee-header ${className}`}>
      <NavLink className="inline-flex" to="/dashboard" aria-label="SportSee — Dashboard">
        <SportSeeLogo />
      </NavLink>
      {children}
    </header>
  );
}
