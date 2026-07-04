import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white shadow-sm">
            CLT
          </span>
          <span className="text-lg">
            Calcula<span className="text-brand-600">CLT</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          <Link
            href="/calculadora-fgts-rescisao"
            className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            FGTS
          </Link>
          <Link
            href="/calculadora-ferias-proporcionais"
            className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            Férias
          </Link>
          <Link
            href="/sobre"
            className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900"
          >
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
