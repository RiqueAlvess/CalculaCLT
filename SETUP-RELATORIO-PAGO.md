# Configurando o relatório pago (Kiwify + Supabase + Resend)

Este documento cobre a configuração manual necessária, feita fora do código,
para o fluxo: calculadora → página de vendas → checkout Kiwify → webhook →
PDF por e-mail → página de obrigado.

A calculadora em si continua 100% gratuita e funcional sem nenhuma dessas
integrações — elas só entram em ação quando alguém decide comprar o
relatório em PDF.

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

### 3.1 Cadastrar o produto

1. No painel da Kiwify, cadastre um novo produto: **"Relatório CalculaCLT"**,
   preço **R$ 14,90**, entrega digital (sem arquivo anexado — a entrega é
   feita pelo nosso webhook, não pelo painel da Kiwify).
2. Em **Redirecionamento pós-compra** (ou campo equivalente na tela de
   checkout do produto), configure a URL para:
   `https://SEU_DOMINIO/obrigado`
   Não é necessário (nem confirmado que a Kiwify suporte) passar parâmetros
   dinâmicos nessa URL — a página `/obrigado` identifica o pedido pelo ID
   salvo no navegador do próprio comprador antes do redirecionamento para o
   checkout.
3. Copie o **link de checkout** do produto (algo como
   `https://pay.kiwify.com.br/XXXXXXX`) → variável
   `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL`. Esse link precisa aceitar o parâmetro
   de rastreio `s1` na URL (a Kiwify aceita isso nativamente para qualquer
   checkout — é isso que carrega o ID do cálculo até o webhook).

### 3.2 Configurar o webhook

1. No painel da Kiwify, vá em **Apps → Webhooks → Criar Webhook**.
2. Escolha o produto "Relatório CalculaCLT" e o evento **compra aprovada**
   (`order_status = paid`).
3. Defina a URL de destino como:
   `https://SEU_DOMINIO/api/webhook/kiwify?token=UM_SEGREDO_ALEATORIO_SEU`
   Gere um valor aleatório longo para `UM_SEGREDO_ALEATORIO_SEU` (ex.: um
   UUID) e use o mesmo valor na variável de ambiente `KIWIFY_WEBHOOK_SECRET`.
4. Salve. A Kiwify deve exibir um "token de segurança" próprio do webhook —
   se ele for diferente do que você colocou na URL, o mais seguro é usar
   **esse valor gerado pela Kiwify** como `KIWIFY_WEBHOOK_SECRET` em vez do
   seu, e reconfigurar a URL do webhook para incluí-lo.

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

```
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
NEXT_PUBLIC_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/XXXXXXX
KIWIFY_WEBHOOK_SECRET=um-segredo-aleatorio-longo
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=a-service-role-key-do-supabase
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=CalculaCLT <relatorio@seudominio.com.br>
```

## 5. Removendo o relatório pago (se decidir não usar)

Se em algum momento quiser voltar a ter só as calculadoras gratuitas: remova
`app/relatorio-completo`, `app/obrigado`, `app/api/save-calculo`,
`app/api/webhook`, `app/api/relatorio`, `lib/supabase.ts`, `lib/kiwify.ts`,
`lib/resend.ts`, `lib/pdf/`, `lib/relatorio/`, o componente `ReportUpsell`
(e sua importação nas duas calculadoras), e as dependências
`@supabase/supabase-js`, `resend` e `@react-pdf/renderer` do `package.json`.
