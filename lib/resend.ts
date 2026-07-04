import { Resend } from "resend";

export async function enviarRelatorioPorEmail(params: {
  to: string;
  customerName: string | null;
  pdfBuffer: Buffer;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY não configurada.");
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "CalculaCLT <onboarding@resend.dev>";
  const saudacao = params.customerName ? `Olá, ${params.customerName}!` : "Olá!";

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Seu relatório CalculaCLT está pronto",
    html: `
      <p>${saudacao}</p>
      <p>Seu relatório completo em PDF está em anexo neste e-mail.</p>
      <p>Qualquer dúvida, é só responder esta mensagem.</p>
      <p>— Equipe CalculaCLT</p>
    `,
    attachments: [
      {
        filename: "relatorio-calculaclt.pdf",
        content: params.pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(`Falha ao enviar e-mail via Resend: ${error.message}`);
  }
}
