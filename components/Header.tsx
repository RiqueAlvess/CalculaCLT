import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-600 text-xs text-white">
            CLT
          </span>
          <span className="text-lg">
            Calcula<span className="text-accent-600">CLT</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          <Link
            href="/calculadora-fgts-rescisao"
            className="hidden rounded-full px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900 sm:block"
          >
            FGTS
          </Link>
          <Link
            href="/calculadora-ferias-proporcionais"
            className="hidden rounded-full px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900 sm:block"
          >
            Férias
          </Link>
          <Link
            href="/sobre"
            className="rounded-full px-4 py-2 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
