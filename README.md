# CalculaCLT

Duas calculadoras trabalhistas brasileiras gratuitas, 100% client-side, construídas com
Next.js (App Router) + TypeScript + Tailwind CSS:

- **FGTS + Multa Rescisória** — `/calculadora-fgts-rescisao`
- **Férias Proporcionais CLT** — `/calculadora-ferias-proporcionais`

Site estático (SSG), sem backend, sem banco de dados, sem login. Todo o cálculo roda no
navegador do usuário.

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
  sitemap.ts / robots.ts                → SEO técnico
  icon.tsx / apple-icon.tsx             → Favicons gerados dinamicamente
components/
  calculators/                          → Formulários e campos das calculadoras
  ...                                   → Header, Footer, FAQ, AdSlot, etc.
lib/
  calculations/                         → Lógica pura de cálculo (fgts.ts, ferias.ts)
  format.ts, schema.ts, site.ts         → Utilitários compartilhados
```

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
4. Em **Environment Variables**, adicione `NEXT_PUBLIC_SITE_URL` com o domínio de produção.
5. Clique em **Deploy**. Em poucos minutos o site estará no ar em um subdomínio
   `*.vercel.app`, e você pode apontar um domínio próprio em **Settings → Domains**.

Nenhuma configuração adicional de servidor, banco de dados ou variáveis secretas é
necessária — o projeto é 100% estático e roda inteiramente no plano gratuito da Vercel.

## Aviso legal

Os cálculos desta ferramenta são estimativas educacionais baseadas nas regras gerais da
CLT e não substituem o cálculo oficial de um contador, do RH da empresa ou do sindicato da
categoria.
