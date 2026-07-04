import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-bold text-slate-900">
              Calcula<span className="text-accent-600">CLT</span>
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
                <Link href="/calculadora-fgts-rescisao" className="hover:text-accent-600">
                  FGTS + Multa Rescisória
                </Link>
              </li>
              <li>
                <Link href="/calculadora-ferias-proporcionais" className="hover:text-accent-600">
                  Férias Proporcionais
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Institucional</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/sobre" className="hover:text-accent-600">
                  Sobre o CalculaCLT
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-accent-600">
                  Página inicial
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-8 text-xs leading-relaxed text-slate-400">
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
