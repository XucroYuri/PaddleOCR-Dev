import Link from "next/link";
import type { ReactNode } from "react";

import { primaryNavigation } from "@/lib/navigation";

export function AppShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">
            面向教培场景的文档转 Word 产品线。上游通过 PaddleOCR-VL-1.5 API
            解析，下游交付可编辑的 DOCX。
          </p>
        </div>
        <nav className="hero-nav" aria-label="主导航">
          {primaryNavigation.map((item) => (
            <Link key={item.href} className="nav-chip" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="content-grid">{children}</main>
    </div>
  );
}

