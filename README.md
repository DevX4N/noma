# NOMA — E-commerce de moda premium (conceito)

Projeto de portfólio: loja completa de uma marca **fictícia** de moda premium / streetwear sofisticado.
Nada é vendido de verdade — pagamentos, conta e newsletter são simulados no navegador.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3012
npm run build      # 37 páginas estáticas
```

## Stack
Next.js 15 (App Router, SSG) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · lucide-react.

## Páginas
- `/` Home — hero, New Arrivals, The Silence Collection, categorias, Signature Coat (hotspots + lupa), manifesto, journal
- `/colecao/[new|masculino|feminino|essentials]` — catálogo com filtros (drawer), ordenação, grade 4/2
- `/produto/[slug]` — galeria ~60%, painel sticky, guia de tamanhos, zoom, "Complete the look"
- `/checkout` — Identificação → Entrega (CEP via ViaCEP) → Pagamento (PIX, cartão, Apple/Google Pay demo) → Confirmação
- `/journal`, `/journal/[slug]`, `/lookbook`, `/favoritos`, `/conta`

Sacola e favoritos persistem em `localStorage`. Cupom de teste: `NOMA10`. Cartão de teste: `4242 4242 4242 4242`.

## Sistema visual
- Cores: preto `#0B0B0A`, grafite `#1A1917`, off-white `#F2F1ED`, névoa `#E7E5DF`, areia `#D6CCBE`, pedra `#8A857C`, cromado `#B9BDC1`
- Tipos: **Mona Sans** (variável, eixo de largura 75–125) + **Martian Mono** para rótulos
- Assinaturas: texto do hero em `mix-blend-mode: difference` com "remain." se expandindo no eixo de largura; lupa 2,6× com indicadores no Signature Coat; manifesto que se expande com o scroll; logo cromado gigante no rodapé

## Conteúdo
- Dados em `src/lib/products.ts` e `src/lib/journal.ts`
- Fotos: Unsplash (licença Unsplash), baixadas e otimizadas por `tools/prepare-images.mjs` (gera `src/lib/images.json` com blur)
- Indexação desligada (`noindex` + robots) até `SITE_INDEXABLE=true`

## Ferramentas de revisão
`tools/shot.mjs` (capturas), `tools/flow.mjs` (compra ponta a ponta), `tools/ui.mjs` (estados de UI) — Puppeteer + Chrome local.
