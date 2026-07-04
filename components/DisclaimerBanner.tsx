export default function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 sm:text-sm">
      <span aria-hidden="true" className="mt-0.5 text-base">
        ⚠️
      </span>
      <p>
        Este resultado é uma <strong>estimativa educacional</strong>, calculada com base nas
        regras gerais da CLT. Convenções coletivas, acordos específicos e particularidades do seu
        contrato podem alterar o valor final. Confirme sempre com um contador ou o sindicato da
        sua categoria antes de tomar qualquer decisão.
      </p>
    </div>
  );
}
