import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[80svh] flex-col justify-center pb-20 pt-32">
      <p className="eyebrow text-stone-deep">Erro 404</p>
      <h1 className="wd-exp mt-6 text-[clamp(2.6rem,8vw,8rem)] font-[250] uppercase leading-[0.9] tracking-[-0.03em]">Página não encontrada</h1>
      <p className="mt-6 max-w-md text-[15px] text-stone-deep">O endereço pode ter mudado ou a peça saiu de linha. Comece pela coleção atual.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/colecao/new" className="btn btn-dark">Ver New Collection</Link>
        <Link href="/" className="btn btn-line">Voltar ao início</Link>
      </div>
    </div>
  );
}
