export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://calcula-clt.vercel.app";
export const SITE_NAME = "CalculaCLT";

// Checkout do produto "Relatório CalculaCLT" na Kiwify. Pode ser sobrescrito
// via NEXT_PUBLIC_KIWIFY_CHECKOUT_URL caso o link mude no futuro.
export const KIWIFY_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL || "https://pay.kiwify.com.br/6d9HiEI";

export const NAV_LINKS = [
  { href: "/calculadora-fgts-rescisao", label: "FGTS + Rescisão" },
  { href: "/calculadora-ferias-proporcionais", label: "Férias Proporcionais" },
  { href: "/sobre", label: "Sobre" },
];
