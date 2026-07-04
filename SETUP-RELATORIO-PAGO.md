# Configurando o relatório pago (Kiwify + Supabase + Resend)

Este documento cobre a configuração manual necessária, feita fora do código,
para o fluxo: calculadora → página de vendas → checkout Kiwify → webhook →
PDF por e-mail → página de obrigado.

A calculadora em si continua 100% gratuita e funcional sem nenhuma dessas
integrações — elas só entram em ação quando alguém decide comprar o
relatório em PDF.

**Já configurado no código** (`lib/site.ts`), com o domínio de produção
`https://calcula-clt.vercel.app` e o checkout Kiwify
`https://pay.kiwify.com.br/6d9HiEI`:

- **Link do webhook para cadastrar na Kiwify:**
  `https://calcula-clt.vercel.app/api/webhook/kiwify?token=189715ba-c4d3-4ba3-ae34-2821768d4c00`
- **Redirecionamento pós-compra para cadastrar na Kiwify:**
  `https://calcula-clt.vercel.app/obrigado`

O token acima (`189715ba-c4d3-4ba3-ae34-2821768d4c00`) foi gerado agora e
**ainda não está ativo** — ele só passa a validar de verdade quando você
definir a variável de ambiente `KIWIFY_WEBHOOK_SECRET` com esse mesmo valor
no painel da Vercel (Settings → Environment Variables) e fizer o redeploy.
Se preferir, gere seu próprio valor aleatório em vez deste — só use o mesmo
nos dois lugares (URL do webhook na Kiwify e variável no Vercel).

Ainda faltam Supabase e Resend (seções 1 e 2 abaixo) para o fluxo funcionar
de ponta a ponta — sem eles, o webhook responde com erro 500 mesmo com o
token correto.

## 1. Supabase (armazenamento temporário do cálculo)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** e rode o conteúdo de `supabase/schema.sql` deste
   repositório. Isso cria a tabela `pending_reports` com Row Level Security
   habilitado e **sem políticas permissivas para o público** — só o backend
   (via service_role key) consegue ler/escrever.
3. Em **Settings → API**, copie:
   - `Project URL` → variável `SUPABASE_URL`
   - `service_role` key (não a `anon` key) → variável `SUPABASE_SERVICE_ROLE_KEY`

   A `service_role` key ignora o RLS e nunca deve ser exposta no browser —
   ela só é usada dentro das API Routes do Next.js (`app/api/**`), que rodam
   no servidor.
4. (Opcional) Configure uma limpeza periódica das linhas expiradas — veja o
   comentário no final de `supabase/schema.sql`.

## 2. Resend (envio do PDF por e-mail)

1. Crie uma conta gratuita em [resend.com](https://resend.com).
2. Gere uma API key em **API Keys** → variável `RESEND_API_KEY`.
3. Verifique um domínio próprio em **Domains** para poder enviar como
   `relatorio@seudominio.com.br` (variável `RESEND_FROM_EMAIL`). Sem domínio
   verificado, o Resend permite enviar apenas a partir de
   `onboarding@resend.dev` — funciona para testes, mas não é ideal para
   produção.

## 3. Kiwify (checkout e webhook)

### 3.1 Produto e link de checkout

O produto **"Relatório CalculaCLT"** já foi cadastrado com o link de
checkout `https://pay.kiwify.com.br/6d9HiEI` (já embutido no código como
padrão em `lib/site.ts`). Confirme no painel da Kiwify que:

- O preço está em **R$ 14,90**.
- A entrega é digital, sem arquivo anexado no produto — quem entrega o PDF
  é o nosso webhook, não o painel da Kiwify.
- Em **Redirecionamento pós-compra**, a URL está configurada para:
  `https://calcula-clt.vercel.app/obrigado`
  Não é necessário (nem confirmado que a Kiwify suporte) passar parâmetros
  dinâmicos nessa URL — a página `/obrigado` identifica o pedido pelo ID
  salvo no navegador do próprio comprador antes do redirecionamento para o
  checkout.

### 3.2 Configurar o webhook

1. No painel da Kiwify, vá em **Apps → Webhooks → Criar Webhook**.
2. Escolha o produto "Relatório CalculaCLT" e o evento **compra aprovada**
   (`order_status = paid`).
3. Defina a URL de destino como:
   `https://calcula-clt.vercel.app/api/webhook/kiwify?token=189715ba-c4d3-4ba3-ae34-2821768d4c00`
4. Salve. A Kiwify deve exibir um "token de segurança" próprio do webhook —
   se ele for diferente do token na URL acima, o mais seguro é usar **esse
   valor gerado pela Kiwify** como `KIWIFY_WEBHOOK_SECRET` no Vercel em vez
   do nosso, e reconfigurar a URL do webhook para incluí-lo.

### 3.3 Testar antes de ir para produção (importante)

O formato exato do payload de webhook da Kiwify (nomes de campos como
`Customer`, `Product`, `TrackingParameters`) foi implementado com base na
documentação pública disponível e em integrações de terceiros — **não foi
validado contra uma chamada real da Kiwify**. Antes de considerar isso
pronto:

1. Use a ferramenta de teste/sandbox de webhooks da Kiwify (ou faça uma
   compra de teste real, se disponível) para capturar o payload real.
2. Compare com o que `lib/kiwify.ts` espera (`extractReportId`,
   `extractCustomer`, `isOrderApproved`). Ajuste os nomes de campo se
   necessário — está tudo centralizado nesse arquivo.
3. Confirme especialmente onde a Kiwify realmente envia o valor de `s1`: a
   expectativa é `TrackingParameters.s1`, mas pode variar.

## 4. Variáveis de ambiente (Vercel → Settings → Environment Variables)

`NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL` já têm um valor
padrão certo no código (`lib/site.ts`) — só precisa defini-las aqui se
algum dos dois mudar. As demais são obrigatórias:

```
KIWIFY_WEBHOOK_SECRET=189715ba-c4d3-4ba3-ae34-2821768d4c00
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=a-service-role-key-do-supabase
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=CalculaCLT <relatorio@seudominio.com.br>
```

Depois de adicionar/alterar variáveis de ambiente no Vercel, é preciso fazer
um novo deploy (redeploy) para elas passarem a valer.

## 5. Removendo o relatório pago (se decidir não usar)

Se em algum momento quiser voltar a ter só as calculadoras gratuitas: remova
`app/relatorio-completo`, `app/obrigado`, `app/api/save-calculo`,
`app/api/webhook`, `app/api/relatorio`, `lib/supabase.ts`, `lib/kiwify.ts`,
`lib/resend.ts`, `lib/pdf/`, `lib/relatorio/`, o componente `ReportUpsell`
(e sua importação nas duas calculadoras), e as dependências
`@supabase/supabase-js`, `resend` e `@react-pdf/renderer` do `package.json`.
