export type Article = {
  slug: string;
  number: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  image: string;
  excerpt: string;
  body: { heading?: string; text: string }[];
  quote?: string;
  products?: string[];
};

export const articles: Article[] = [
  {
    slug: 'the-architecture-of-simplicity',
    number: '01',
    title: 'The Architecture of Simplicity',
    category: 'Design',
    date: '12 set 2026',
    readingTime: '6 min',
    image: '/images/j/architecture.webp',
    excerpt: 'O que o concreto aparente ensina sobre cortar um casaco: remover até sobrar só a estrutura.',
    quote: 'Uma peça está pronta quando não há mais nada para tirar.',
    body: [
      { text: 'Antes de desenhar a FW26, a equipe passou duas semanas fotografando edifícios brutalistas em São Paulo. Não pela estética, mas pelo método: no concreto aparente, a estrutura é o acabamento. Não há revestimento escondendo decisões ruins.' },
      { heading: 'Estrutura como acabamento', text: 'O Noiré Signature Coat nasceu dessa ideia. Sem forro e sem entretela, a forma vem da lã dupla face, trabalhada a vapor até segurar a lapela sozinha. Cada costura fica visível por dentro, aberta à mão, porque não há nada a esconder.' },
      { heading: 'Menos elementos, mais precisão', text: 'Quando uma peça tem poucos elementos, cada um precisa estar exatamente no lugar. A altura de um bolso muda a proporção do corpo; dois milímetros na lapela mudam o rosto. Simplicidade não é fazer menos, é errar menos.' },
      { text: 'O resultado são roupas que parecem óbvias. É o maior elogio que um desenho pode receber.' },
    ],
    products: ['noire-signature-coat', 'tailored-blazer', 'structured-jacket'],
  },
  {
    slug: 'behind-the-collection',
    number: '02',
    title: 'Behind the Collection',
    category: 'Atelier',
    date: '28 ago 2026',
    readingTime: '8 min',
    image: '/images/j/behind.webp',
    excerpt: 'Dezoito horas por casaco. Um dia no ateliê onde a FW26 ganha forma, ponto a ponto.',
    quote: 'A máquina costura. A mão decide.',
    body: [
      { text: 'O ateliê da NOMA fica num galpão no Bom Retiro, a três quadras de onde a maioria dos nossos tecidos é cortada. São onze pessoas, sete delas com mais de vinte anos de ofício.' },
      { heading: 'O tempo de uma peça', text: 'Um Signature Coat leva dezoito horas do corte ao último ponto. Metade disso é feita à mão: abrir costuras, moldar a lapela a vapor, pregar botões com haste. É um tempo que não cabe numa lógica de coleção por mês.' },
      { heading: 'Produção limitada por escolha', text: 'Cada modelo da FW26 tem tiragem numerada. Quando acaba, não volta na mesma cor. Isso não é estratégia de escassez: é o limite honesto do que conseguimos fazer bem.' },
    ],
    products: ['noire-signature-coat', 'silence-trench'],
  },
  {
    slug: 'materials-that-matter',
    number: '03',
    title: 'Materials That Matter',
    category: 'Materiais',
    date: '09 ago 2026',
    readingTime: '5 min',
    image: '/images/j/materials.webp',
    excerpt: 'Merino de 17,5 mícrons, lã de Biella e algodão Pima. Por que a origem do fio define quanto uma peça dura.',
    quote: 'Uma roupa dura o que dura o fio.',
    body: [
      { text: 'Quase todo desgaste começa no fio. Fibras curtas soltam bolinhas; fibras grossas pinicam e perdem a forma. Por isso a escolha de matéria-prima é a decisão mais cara, e mais importante, de cada peça.' },
      { heading: 'Merino extrafino', text: 'Nossos tricôs usam merino abaixo de 18 mícrons. Para comparação, um fio de cabelo tem cerca de 70. A fibra fina é o que torna a lã macia contra a pele, sem precisar de tratamento químico.' },
      { heading: 'Algodão de fibra longa', text: 'A Essential Tee usa algodão Pima peruano, de fibra extralonga. A malha fica mais lisa, resiste a lavagens e não torce na lateral: por isso o corpo é tubular, sem costura.' },
    ],
    products: ['oversized-knit', 'essential-tee', 'merino-turtleneck'],
  },
  {
    slug: 'a-study-in-grey',
    number: '04',
    title: 'A Study in Grey',
    category: 'Cor',
    date: '22 jul 2026',
    readingTime: '4 min',
    image: '/images/j/stairs.webp',
    excerpt: 'Onze tons entre o preto e o off-white. Como construímos a paleta da FW26 a partir da sombra.',
    body: [
      { text: 'A paleta da FW26 foi medida, não escolhida. Fotografamos a mesma escada de concreto ao longo de um dia e extraímos os tons da sombra a cada hora. O resultado são onze cinzas quentes que aparecem em toda a coleção.' },
      { heading: 'Cinza quente', text: 'Um cinza com fundo levemente amarelado conversa com a pele de forma mais gentil que o cinza azulado. É a diferença entre uma roupa que veste e uma roupa que apaga.' },
    ],
    products: ['grey-wool-coat', 'crew-knit'],
  },
  {
    slug: 'the-folded-wardrobe',
    number: '05',
    title: 'The Folded Wardrobe',
    category: 'Guia',
    date: '03 jul 2026',
    readingTime: '7 min',
    image: '/images/j/folded.webp',
    excerpt: 'Doze peças, trinta combinações. Um guia prático para montar um guarda-roupa que dispensa decisões.',
    body: [
      { text: 'Um guarda-roupa funcional não precisa de muitas peças, precisa de peças que conversem entre si. A regra que usamos: toda peça nova deve combinar com pelo menos três que você já tem.' },
      { heading: 'A base', text: 'Duas camisetas de malha pesada, uma manga longa, um tricô de gola alta, uma calça de alfaiataria e um casaco. Com isso, você veste dez dias sem repetir o look inteiro.' },
    ],
    products: ['essential-tee', 'heavy-long-sleeve', 'tailored-trouser'],
  },
  {
    slug: 'curves-and-shadows',
    number: '06',
    title: 'Curves and Shadows',
    category: 'Campanha',
    date: '18 jun 2026',
    readingTime: '3 min',
    image: '/images/j/curve.webp',
    excerpt: 'Os bastidores da campanha FW26, fotografada em uma única tarde, com luz natural.',
    body: [
      { text: 'Nenhum refletor, nenhuma retocagem de forma. A campanha FW26 foi fotografada em uma tarde de junho, em um estúdio com uma única janela voltada para o oeste.' },
      { heading: 'Luz como material', text: 'Quando a luz é dura, a roupa precisa ter estrutura para não desaparecer na sombra. Foi o teste final da coleção.' },
    ],
    products: ['silence-trench', 'oversized-knit'],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
