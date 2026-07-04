# CalculaCLT

Duas calculadoras trabalhistas brasileiras gratuitas, 100% client-side, construídas com
Next.js (App Router) + TypeScript + Tailwind CSS:

- **FGTS + Multa Rescisória** — `/calculadora-fgts-rescisao`
- **Férias Proporcionais CLT** — `/calculadora-ferias-proporcionais`

As calculadoras em si são 100% estáticas (SSG) e client-side — sem backend, sem banco de
dados, sem login. Todo o cálculo roda no navegador do usuário.

Opcionalmente, o site também vende um **relatório em PDF** do cálculo
(`/relatorio-completo`, R$ 5,99 via Kiwify). Esse fluxo pago é a única parte que usa
backend (API Routes + Supabase + Resend) — veja `SETUP-RELATORIO-PAGO.md` para configurá-lo.
Sem essa configuração, as calculadoras continuam funcionando normalmente; só o botão
"Gerar relatório em PDF" fica sem efeito útil.

## Rodando localmente

Pré-requisitos: Node.js 18.18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para gerar o build de produção localmente:

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/
  page.tsx                              → Home (hub das calculadoras)
  calculadora-fgts-rescisao/page.tsx    → Calculadora de FGTS + multa rescisória
  calculadora-ferias-proporcionais/     → Calculadora de férias proporcionais
  sobre/page.tsx                        → Página institucional
  relatorio-completo/page.tsx           → Página de vendas do relatório em PDF
  obrigado/page.tsx                     → Página pós-compra (Kiwify)
  api/save-calculo/                     → Salva o cálculo antes do checkout (Supabase)
  api/webhook/kiwify/                   → Webhook de confirmação de compra
  api/relatorio/[id]/                   → Download do PDF + status do pedido
  sitemap.ts / robots.ts                → SEO técnico
  icon.tsx / apple-icon.tsx             → Favicons gerados dinamicamente
components/
  calculators/                          → Formulários, campos e upsell do relatório
  relatorio/                            → Página de vendas, mockup do PDF, página de obrigado
  ...                                   → Header, Footer, FAQ, AdSlot, etc.
lib/
  calculations/                         → Lógica pura de cálculo (fgts.ts, ferias.ts)
  pdf/                                  → Geração do relatório em PDF (@react-pdf/renderer)
  relatorio/                            → Tipos e ponte via sessionStorage entre calculadora e venda
  supabase.ts, kiwify.ts, resend.ts     → Integrações do relatório pago
  format.ts, schema.ts, site.ts         → Utilitários compartilhados
supabase/schema.sql                     → Migração da tabela pending_reports
```

Veja `SETUP-RELATORIO-PAGO.md` para o passo a passo de configuração do relatório pago
(Kiwify, Supabase, Resend).

## Configuração antes do deploy

1. **Domínio**: defina a variável de ambiente `NEXT_PUBLIC_SITE_URL` com a URL final do
   site (ex.: `https://www.calculaclt.com.br`). Ela é usada em `lib/site.ts` para gerar
   metadata, Open Graph, sitemap e dados estruturados. Sem essa variável, o site usa um
   domínio placeholder.
2. **Google AdSense**: os espaços de anúncio já estão reservados no componente
   `components/AdSlot.tsx` e posicionados abaixo do resultado de cada calculadora e no
   meio do conteúdo textual. Depois de aprovado no AdSense, adicione o script oficial via
   `next/script` em `app/layout.tsx` (estratégia `afterInteractive`) e substitua o
   conteúdo de `AdSlot.tsx` pelo `<ins className="adsbygoogle">` correspondente.

## Deploy na Vercel

1. Suba o repositório para o GitHub (ou outro provedor suportado).
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório — a Vercel detecta automaticamente que é um projeto Next.js e
   configura o build (`next build`) e o output.
4. Em **Environment Variables**, adicione pelo menos `NEXT_PUBLIC_SITE_URL` com o domínio
   de produção. Se for habilitar o relatório pago, adicione também as variáveis descritas em
   `SETUP-RELATORIO-PAGO.md`.
5. Clique em **Deploy**. Em poucos minutos o site estará no ar em um subdomínio
   `*.vercel.app`, e você pode apontar um domínio próprio em **Settings → Domains**.

As calculadoras são servidas como páginas estáticas. As rotas em `app/api/**` (usadas só
pelo relatório pago) rodam como funções serverless da Vercel — ainda dentro do plano
gratuito, mas isso significa que o projeto não é mais 100% estático se você habilitar essa
parte.

## Aviso legal

Os cálculos desta ferramenta são estimativas educacionais baseadas nas regras gerais da
CLT e não substituem o cálculo oficial de um contador, do RH da empresa ou do sindicato da
categoria.
