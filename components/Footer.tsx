import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-bold text-slate-900">
              Calcula<span className="text-brand-600">CLT</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Calculadoras trabalhistas gratuitas, rápidas e diretas ao ponto para quem
              trabalha sob a CLT no Brasil.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Calculadoras</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/calculadora-fgts-rescisao" className="hover:text-brand-600">
                  FGTS + Multa Rescisória
                </Link>
              </li>
              <li>
                <Link href="/calculadora-ferias-proporcionais" className="hover:text-brand-600">
                  Férias Proporcionais
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Institucional</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/sobre" className="hover:text-brand-600">
                  Sobre o CalculaCLT
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Página inicial
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-400">
          <p>
            Os resultados apresentados neste site são <strong>estimativas educacionais</strong> e
            não substituem o cálculo oficial feito por um contador, pelo departamento de RH da
            empresa ou pelo sindicato da categoria. Antes de tomar qualquer decisão, valide os
            valores com um profissional habilitado.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} CalculaCLT. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
