# Configurando o relatório pago (Kiwify + Resend)

Este documento cobre a configuração manual, feita fora do código, para o
fluxo: calculadora → página de vendas → checkout Kiwify → página de
obrigado → PDF gerado no navegador (download imediato + cópia opcional por
e-mail).

A calculadora em si continua 100% gratuita e funcional sem nenhuma dessas
integrações — elas só entram em ação quando alguém decide comprar o
relatório em PDF.

## Como funciona (sem banco de dados)

Não há Supabase, webhook nem nenhum servidor guardando os dados do seu
cálculo. O fluxo é:

1. Você calcula em uma das calculadoras; o resultado fica guardado só no
   `sessionStorage` do seu navegador (não sai da sua máquina).
2. Ao clicar em "Gerar relatório em PDF", você vai para `/relatorio-completo`.
3. Ao clicar em "Gerar meu relatório agora", você é levado direto para o
   checkout da Kiwify (`https://pay.kiwify.com.br/6d9HiEI`, já configurado
   em `lib/site.ts`).
4. Depois de pagar, a Kiwify te traz de volta (mesma aba do navegador) para
   `/obrigado`. Essa página lê os mesmos dados do `sessionStorage` — que
   continuam lá porque é a mesma aba — e monta o PDF ali mesmo, na hora,
   sem enviar nada para nenhum servidor.
5. Você pode baixar o PDF na hora e, opcionalmente, digitar seu e-mail para
   receber uma cópia (isso aí sim passa por um servidor simples, só para
   disparar o e-mail — sem guardar nada).

**Troca consciente de segurança**: como não há confirmação real de
pagamento no servidor, tecnicamente alguém que soubesse a URL `/obrigado` e
tivesse acabado de calcular na mesma aba poderia gerar o PDF sem pagar. Para
um produto de R$ 5,99 sem manutenção ativa, essa é uma troca aceitável pela
simplicidade — mas é bom você saber que ela existe. Se um dia isso virar um
problema real (uso indevido em volume), o caminho é voltar a ter uma
confirmação de pagamento no servidor antes de liberar o PDF.

## 1. Resend (envio opcional do PDF por e-mail)

1. Crie uma conta gratuita em [resend.com](https://resend.com).
2. Gere uma API key em **API Keys** → variável `RESEND_API_KEY`.
3. Verifique um domínio próprio em **Domains** para poder enviar como
   `relatorio@seudominio.com.br` (variável `RESEND_FROM_EMAIL`). Sem domínio
   verificado, o Resend permite enviar apenas a partir de
   `onboarding@resend.dev` — funciona para testes, mas não é ideal para
   produção.
4. Sem essa configuração, o download imediato no navegador continua
   funcionando normalmente — só a opção "receber por e-mail" fica sem
   efeito (retorna erro, tratado com uma mensagem amigável na página).

## 2. Kiwify (checkout)

O produto **"Relatório CalculaCLT"** e o link de checkout
`https://pay.kiwify.com.br/6d9HiEI` já estão configurados como padrão no
código (`lib/site.ts`). No painel da Kiwify, confirme:

- O preço está em **R$ 5,99**.
- A entrega é digital, sem arquivo anexado no produto — a entrega acontece
  na página `/obrigado`, não pelo painel da Kiwify.
- Em **Redirecionamento pós-compra**, a URL está configurada para:
  `https://calcula-clt.vercel.app/obrigado`

Não é necessário criar nenhum webhook — esta versão simplificada não
depende dele.

## 3. Variáveis de ambiente (Vercel → Settings → Environment Variables)

`NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL` já têm um valor
padrão certo no código — só precisa defini-las se algum dos dois mudar.
A única obrigatória (para o envio de e-mail funcionar) é:

```
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=CalculaCLT <relatorio@seudominio.com.br>
```

Depois de adicionar/alterar variáveis de ambiente no Vercel, é preciso fazer
um novo deploy (redeploy) para elas passarem a valer.

## 4. Removendo o relatório pago (se decidir não usar)

Se em algum momento quiser voltar a ter só as calculadoras gratuitas: remova
`app/relatorio-completo`, `app/obrigado`, `app/api/enviar-email`,
`lib/resend.ts`, `lib/pdf/`, `lib/relatorio/`, o componente `ReportUpsell`
(e sua importação nas duas calculadoras), e as dependências `resend` e
`@react-pdf/renderer` do `package.json`.
