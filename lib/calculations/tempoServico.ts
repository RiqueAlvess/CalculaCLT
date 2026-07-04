const MS_PER_DAY = 86400000;

export interface TempoServico {
  anos: number;
  meses: number;
  dias: number;
  totalMonthsFloor: number;
  totalDays: number;
}

/**
 * Calendar-accurate diff (anos/meses/dias), matching how Brazilian labor
 * calculations count "tempo de serviço" (not a raw day-count average).
 */
export function calendarDiff(start: Date, end: Date): TempoServico {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += prevMonthLastDay.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonthsFloor = years * 12 + months;
  const totalDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY));

  return { anos: Math.max(0, years), meses: Math.max(0, months), dias: Math.max(0, days), totalMonthsFloor: Math.max(0, totalMonthsFloor), totalDays };
}

/**
 * Counts "avos" (months, max 12) between start and end (inclusive), applying
 * the CLT rule that a fraction of a month with 15 days or more worked counts
 * as one full month.
 */
export function contarAvos(start: Date, end: Date, maxAvos = 12): number {
  if (end.getTime() < start.getTime()) return 0;

  let avos = 0;
  let cursorYear = start.getUTCFullYear();
  let cursorMonth = start.getUTCMonth();
  const endYear = end.getUTCFullYear();
  const endMonth = end.getUTCMonth();

  while (avos < maxAvos) {
    const monthStart = new Date(Date.UTC(cursorYear, cursorMonth, 1));
    const monthEnd = new Date(Date.UTC(cursorYear, cursorMonth + 1, 0));
    const workStart = monthStart.getTime() > start.getTime() ? monthStart : start;
    const workEnd = monthEnd.getTime() < end.getTime() ? monthEnd : end;

    if (workStart.getTime() <= workEnd.getTime()) {
      const daysWorked = Math.floor((workEnd.getTime() - workStart.getTime()) / MS_PER_DAY) + 1;
      if (daysWorked >= 15) avos += 1;
    }

    if (cursorYear === endYear && cursorMonth === endMonth) break;

    cursorMonth += 1;
    if (cursorMonth > 11) {
      cursorMonth = 0;
      cursorYear += 1;
    }
  }

  return Math.min(avos, maxAvos);
}

/** Start date of the vesting period ("período aquisitivo") currently running. */
export function inicioPeriodoAquisitivoEmCurso(admissao: Date, referencia: Date): Date {
  let anniversary = new Date(Date.UTC(referencia.getUTCFullYear(), admissao.getUTCMonth(), admissao.getUTCDate()));
  if (anniversary.getTime() > referencia.getTime()) {
    anniversary = new Date(Date.UTC(referencia.getUTCFullYear() - 1, admissao.getUTCMonth(), admissao.getUTCDate()));
  }
  if (anniversary.getTime() < admissao.getTime()) {
    anniversary = admissao;
  }
  return anniversary;
}

/** Months (avos) accrued in the vesting period that is currently open/running. */
export function mesesPeriodoAquisitivoEmCurso(admissao: Date, referencia: Date): number {
  const inicio = inicioPeriodoAquisitivoEmCurso(admissao, referencia);
  return contarAvos(inicio, referencia, 12);
}

/** Months (avos) worked in the current calendar year, used for 13º proporcional. */
export function mesesProporcionaisNoAno(admissao: Date, referencia: Date): number {
  const anoRef = referencia.getUTCFullYear();
  const inicioAno = new Date(Date.UTC(anoRef, 0, 1));
  const inicioContagem = admissao.getTime() > inicioAno.getTime() ? admissao : inicioAno;
  return contarAvos(inicioContagem, referencia, 12);
}
