import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full = [{ name: "Início", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(full)} />
      <nav aria-label="breadcrumb" className="mx-auto max-w-3xl px-4 pt-6 text-xs text-slate-500 sm:px-6">
        <ol className="flex flex-wrap items-center gap-1">
          {full.map((item, index) => (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 && <span className="text-slate-300">/</span>}
              {index === full.length - 1 ? (
                <span className="font-medium text-slate-700">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-accent-600">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
