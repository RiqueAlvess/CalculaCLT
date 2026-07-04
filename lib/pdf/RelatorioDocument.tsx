import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatBRL, formatDateBR, parseInputDate } from "@/lib/format";
import type { RelatorioPayload } from "@/lib/relatorio/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#047857",
    paddingBottom: 12,
    marginBottom: 20,
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    color: "#047857",
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 8,
    color: "#0f172a",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 2,
  },
  totalBox: {
    backgroundColor: "#047857",
    borderRadius: 6,
    padding: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#d1fae5",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 10,
    color: "#334155",
  },
  rowHint: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 2,
  },
  rowValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f172a",
  },
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 6,
    fontSize: 8,
    color: "#92400e",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

const TIPO_RESCISAO_LABEL: Record<string, string> = {
  sem_justa_causa: "Sem justa causa",
  pedido_demissao: "Pedido de demissão",
  acordo_mutuo: "Acordo mútuo (distrato)",
  justa_causa: "Justa causa",
};

function Row({ label, hint, value }: { label: string; hint?: string; value: string }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function formatDateSafe(iso: string): string {
  const date = parseInputDate(iso);
  return date ? formatDateBR(date) : iso;
}

export default function RelatorioDocument({ payload }: { payload: RelatorioPayload }) {
  const geradoEm = formatDateBR(new Date());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>CalculaCLT</Text>
          <Text style={styles.subtitle}>Relatório gerado em {geradoEm}</Text>
        </View>

        {payload.tipo === "fgts" ? (
          <FgtsReport payload={payload} />
        ) : (
          <FeriasReport payload={payload} />
        )}

        <Text style={styles.disclaimer}>
          Este relatório apresenta uma estimativa educacional calculada com base nas regras
          gerais da CLT. Convenções coletivas, acordos específicos e particularidades do
          contrato de trabalho podem alterar o valor final. Confirme sempre com um contador, o
          RH da empresa ou o sindicato da categoria antes de tomar qualquer decisão. Este
          documento não é um cálculo trabalhista oficial nem substitui o Termo de Rescisão do
          Contrato de Trabalho (TRCT).
        </Text>

        <Text style={styles.footer} fixed>
          Gerado por CalculaCLT — calculadoras trabalhistas gratuitas
        </Text>
      </Page>
    </Document>
  );
}

function FgtsReport({ payload }: { payload: Extract<RelatorioPayload, { tipo: "fgts" }> }) {
  const { input, resultado } = payload;

  return (
    <>
      <Text style={styles.sectionTitle}>Dados informados</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Salário bruto</Text>
          <Text style={styles.infoValue}>{formatBRL(input.salarioBruto)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tipo de rescisão</Text>
          <Text style={styles.infoValue}>{TIPO_RESCISAO_LABEL[input.tipoRescisao] ?? input.tipoRescisao}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de admissão</Text>
          <Text style={styles.infoValue}>{formatDateSafe(input.dataAdmissao)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de demissão</Text>
          <Text style={styles.infoValue}>{formatDateSafe(input.dataDemissao)}</Text>
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total estimado a receber</Text>
        <Text style={styles.totalValue}>{formatBRL(resultado.totalEstimado)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Detalhamento do cálculo</Text>
      <Row
        label="FGTS sacável agora"
        hint={
          resultado.saldoFgtsEstimado
            ? `Saldo total estimado: ${formatBRL(resultado.saldoFgtsTotal)} (8% a.m.)`
            : `${Math.round(resultado.percentualSaque * 100)}% do saldo de ${formatBRL(resultado.saldoFgtsTotal)}`
        }
        value={formatBRL(resultado.fgtsSacavel)}
      />
      <Row
        label="Multa rescisória"
        hint={`${Math.round(resultado.percentualMulta * 100)}% sobre o saldo do FGTS`}
        value={formatBRL(resultado.multaFgts)}
      />
      <Row
        label="Aviso prévio indenizado"
        hint={`${resultado.avisoPrevioDias} dia(s)`}
        value={formatBRL(resultado.avisoPrevioValor)}
      />
      <Row
        label="13º salário proporcional"
        hint={`${resultado.decimoTerceiroMeses}/12 avos`}
        value={formatBRL(resultado.decimoTerceiroValor)}
      />
      <Row
        label="Férias proporcionais"
        hint={`${resultado.feriasProporcionaisMeses}/12 avos`}
        value={formatBRL(resultado.feriasProporcionaisValor)}
      />
      <Row label="1/3 constitucional sobre férias" value={formatBRL(resultado.tercoConstitucionalValor)} />
    </>
  );
}

function FeriasReport({ payload }: { payload: Extract<RelatorioPayload, { tipo: "ferias" }> }) {
  const { input, resultado } = payload;

  return (
    <>
      <Text style={styles.sectionTitle}>Dados informados</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Salário bruto</Text>
          <Text style={styles.infoValue}>{formatBRL(input.salarioBruto)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de admissão</Text>
          <Text style={styles.infoValue}>{formatDateSafe(input.dataAdmissao)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de referência</Text>
          <Text style={styles.infoValue}>{formatDateSafe(input.dataReferencia)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Vendeu 1/3 (abono)?</Text>
          <Text style={styles.infoValue}>{input.venderAbono ? "Sim" : "Não"}</Text>
        </View>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total estimado a receber</Text>
        <Text style={styles.totalValue}>{formatBRL(resultado.totalEstimado)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Detalhamento do cálculo</Text>
      <Row
        label="Férias proporcionais (gozo)"
        hint={`${resultado.mesesAvos}/12 avos — ${resultado.diasProporcionais} dia(s)`}
        value={formatBRL(resultado.valorFeriasGozo)}
      />
      <Row label="1/3 constitucional (gozo)" value={formatBRL(resultado.tercoSobreGozo)} />
      {resultado.valorAbono > 0 && (
        <>
          <Row
            label="Abono pecuniário (venda de 1/3)"
            hint={`${resultado.diasAbono} dia(s) convertido(s) em dinheiro`}
            value={formatBRL(resultado.valorAbono)}
          />
          <Row label="1/3 constitucional sobre o abono" value={formatBRL(resultado.tercoSobreAbono)} />
        </>
      )}
    </>
  );
}
