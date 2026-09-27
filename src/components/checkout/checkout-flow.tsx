'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, ChevronDown, Copy, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FREE_SHIPPING, MAX_INSTALLMENTS, PIX_DISCOUNT, price, priceCents } from '@/lib/format';
import { img } from '@/lib/img';
import { useStore, type CartLine } from '@/lib/store';
import type { Product } from '@/lib/products';
import { Logo } from '../logo';
import { Field, cardBrand, luhn, masks, validCpf } from './fields';

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ['Identificação', 'Entrega', 'Pagamento', 'Confirmação'];
type Method = 'pix' | 'card' | 'wallet';
type Ship = 'standard' | 'express' | 'pickup';
type Line = CartLine & { product: Product };

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function CheckoutFlow() {
  const store = useStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [id, setId] = useState({ email: '', name: '', cpf: '', phone: '' });
  const [addr, setAddr] = useState({ cep: '', street: '', number: '', extra: '', district: '', city: '', uf: '' });
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle');
  const [ship, setShip] = useState<Ship>('standard');
  const [method, setMethod] = useState<Method>('pix');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
  const [coupon, setCoupon] = useState({ code: '', applied: false, error: '' });
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<null | { number: string; lines: Line[]; subtotal: number; shipCost: number; couponOff: number; pixOff: number; total: number; method: Method; ship: Ship; installments: string }>(null);

  const freeStandard = store.subtotal >= FREE_SHIPPING;
  const shipCost = ship === 'pickup' ? 0 : ship === 'express' ? 69 : freeStandard ? 0 : 39;
  const couponOff = coupon.applied ? Math.round(store.subtotal * 0.1) : 0;
  const pixOff = method === 'pix' && step >= 2 ? Math.round((store.subtotal - couponOff) * PIX_DISCOUNT * 100) / 100 : 0;
  const total = store.subtotal - couponOff - pixOff + shipCost;

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    setErrors({});
    window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Busca de CEP (ViaCEP); se falhar, o endereço é preenchido à mão.
  useEffect(() => {
    const d = addr.cep.replace(/\D/g, '');
    if (d.length !== 8) return setCepState('idle');
    setCepState('loading');
    const ctrl = new AbortController();
    fetch(`https://viacep.com.br/ws/${d}/json/`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        if (j.erro) return setCepState('fail');
        setAddr((a) => ({ ...a, street: j.logradouro || a.street, district: j.bairro || a.district, city: j.localidade || a.city, uf: j.uf || a.uf }));
        setCepState('ok');
      })
      .catch((e) => e.name !== 'AbortError' && setCepState('fail'));
    return () => ctrl.abort();
  }, [addr.cep]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!emailOk(id.email)) e.email = 'Digite um e-mail válido, como nome@email.com.';
      if (id.name.trim().split(/\s+/).length < 2) e.name = 'Informe nome e sobrenome.';
      if (!validCpf(id.cpf)) e.cpf = 'CPF inválido. Confira os 11 dígitos.';
      if (id.phone.replace(/\D/g, '').length < 10) e.phone = 'Informe DDD e número.';
    }
    if (step === 1 && ship !== 'pickup') {
      if (addr.cep.replace(/\D/g, '').length !== 8) e.cep = 'CEP deve ter 8 dígitos.';
      if (!addr.street.trim()) e.street = 'Informe o endereço.';
      if (!addr.number.trim()) e.number = 'Informe o número.';
      if (!addr.district.trim()) e.district = 'Informe o bairro.';
      if (!addr.city.trim()) e.city = 'Informe a cidade.';
      if (!/^[A-Za-z]{2}$/.test(addr.uf)) e.uf = 'UF com 2 letras.';
    }
    if (step === 2 && method === 'card') {
      if (!luhn(card.number)) e.number = 'Número de cartão inválido.';
      if (card.name.trim().length < 3) e.cname = 'Como impresso no cartão.';
      const [m, y] = card.expiry.split('/').map(Number);
      const now = new Date();
      if (!m || m > 12 || !y || 2000 + y < now.getFullYear() || (2000 + y === now.getFullYear() && m < now.getMonth() + 1)) e.expiry = 'Validade inválida.';
      if (card.cvv.length < 3) e.cvv = 'CVV incompleto.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate() && go(step + 1);
  const clearErr = (k: string) => errors[k] && setErrors(({ [k]: _, ...rest }) => rest);

  const place = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setOrder({ number: `NM-${Math.floor(100000 + Math.random() * 900000)}`, lines: store.lines, subtotal: store.subtotal, shipCost, couponOff, pixOff, total, method, ship, installments: card.installments });
      store.clear();
      setProcessing(false);
      go(3);
    }, 1600);
  };

  if (store.ready && store.lines.length === 0 && !order) {
    return (
      <Shell step={-1}>
        <div className="gutter flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="wd-wide text-[30px] font-[300] tracking-[-0.02em]">Sua sacola está vazia.</p>
          <p className="mt-3 text-[14px] text-stone-deep">Adicione uma peça para seguir para o pagamento.</p>
          <Link href="/colecao/new" className="btn btn-dark mt-8">Explorar coleção</Link>
        </div>
      </Shell>
    );
  }

  const lines = order ? order.lines : store.lines;

  return (
    <Shell step={step} onStep={(n) => n < step && step < 3 && go(n)}>
      <div className="gutter grid grid-cols-1 gap-10 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.45, ease }}
            >
              {step === 0 && (
                <Step title="Identificação" lead="Usamos seu e-mail para enviar a confirmação e o rastreio.">
                  <div>
                    <p className="eyebrow mb-3 text-stone-deep">Checkout expresso</p>
                    <div className="grid grid-cols-2 gap-2">
                      <WalletButton kind="apple" onClick={() => (setMethod('wallet'), store.notify({ title: 'Apple Pay (demonstração)', body: 'Complete os dados para simular o pedido.' }))} />
                      <WalletButton kind="google" onClick={() => (setMethod('wallet'), store.notify({ title: 'Google Pay (demonstração)', body: 'Complete os dados para simular o pedido.' }))} />
                    </div>
                    <div className="my-8 flex items-center gap-4 text-[12px] text-stone-deep">
                      <span className="h-px flex-1 bg-line" /> ou continue com seus dados <span className="h-px flex-1 bg-line" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <Field className="sm:col-span-2" label="E-mail" type="email" autoComplete="email" value={id.email} onChange={(v) => (setId({ ...id, email: v }), clearErr('email'))} error={errors.email} />
                    <Field className="sm:col-span-2" label="Nome completo" autoComplete="name" value={id.name} onChange={(v) => (setId({ ...id, name: v }), clearErr('name'))} error={errors.name} />
                    <Field label="CPF" inputMode="numeric" value={id.cpf} onChange={(v) => (setId({ ...id, cpf: masks.cpf(v) }), clearErr('cpf'))} error={errors.cpf} hint="Obrigatório para emissão da nota fiscal." />
                    <Field label="Celular" type="tel" autoComplete="tel-national" inputMode="tel" value={id.phone} onChange={(v) => (setId({ ...id, phone: masks.phone(v) }), clearErr('phone'))} error={errors.phone} />
                  </div>
                  <p className="mt-6 text-[13px] text-stone-deep">
                    Já tem conta? <Link href="/conta" className="link-u text-ink">Entrar</Link>
                  </p>
                  <Actions onNext={next} nextLabel="Continuar para entrega" />
                </Step>
              )}

              {step === 1 && (
                <Step title="Entrega" lead="Enviamos em até 24h úteis após a confirmação do pagamento.">
                  <fieldset>
                    <legend className="eyebrow mb-3 text-stone-deep">Forma de entrega</legend>
                    <div className="space-y-2">
                      <Option checked={ship === 'standard'} onSelect={() => setShip('standard')} title="Padrão" desc="3 a 7 dias úteis" right={freeStandard ? 'Grátis' : price(39)} />
                      <Option checked={ship === 'express'} onSelect={() => setShip('express')} title="Expressa" desc="1 a 2 dias úteis · capitais" right={price(69)} />
                      <Option checked={ship === 'pickup'} onSelect={() => setShip('pickup')} title="Retirar no showroom" desc="Bom Retiro, São Paulo · pronto em 24h" right="Grátis" />
                    </div>
                  </fieldset>
                  <AnimatePresence initial={false}>
                    {ship !== 'pickup' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                        <div className="grid grid-cols-6 gap-x-6 gap-y-6 pt-10">
                          <Field
                            className="col-span-6 sm:col-span-3"
                            label="CEP"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            value={addr.cep}
                            onChange={(v) => (setAddr({ ...addr, cep: masks.cep(v) }), clearErr('cep'))}
                            error={errors.cep}
                            hint={cepState === 'loading' ? 'Buscando endereço…' : cepState === 'ok' ? 'Endereço encontrado. Confira o número.' : cepState === 'fail' ? 'CEP não encontrado. Preencha o endereço abaixo.' : undefined}
                          />
                          <Field className="col-span-6" label="Endereço" autoComplete="address-line1" value={addr.street} onChange={(v) => (setAddr({ ...addr, street: v }), clearErr('street'))} error={errors.street} />
                          <Field className="col-span-2" label="Número" inputMode="numeric" value={addr.number} onChange={(v) => (setAddr({ ...addr, number: v }), clearErr('number'))} error={errors.number} />
                          <Field className="col-span-4" label="Complemento (opcional)" autoComplete="address-line2" value={addr.extra} onChange={(v) => setAddr({ ...addr, extra: v })} />
                          <Field className="col-span-6 sm:col-span-2" label="Bairro" value={addr.district} onChange={(v) => (setAddr({ ...addr, district: v }), clearErr('district'))} error={errors.district} />
                          <Field className="col-span-4 sm:col-span-3" label="Cidade" autoComplete="address-level2" value={addr.city} onChange={(v) => (setAddr({ ...addr, city: v }), clearErr('city'))} error={errors.city} />
                          <Field className="col-span-2 sm:col-span-1" label="UF" autoComplete="address-level1" value={addr.uf} onChange={(v) => (setAddr({ ...addr, uf: v.toUpperCase().slice(0, 2) }), clearErr('uf'))} error={errors.uf} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Actions onBack={() => go(0)} onNext={next} nextLabel="Continuar para pagamento" />
                </Step>
              )}

              {step === 2 && (
                <Step title="Pagamento" lead="Ambiente de demonstração: nenhum pagamento é processado.">
                  <div className="space-y-2">
                    <Option checked={method === 'pix'} onSelect={() => setMethod('pix')} title="PIX" desc="Aprovação imediata · 5% de desconto" right={<span className="eyebrow bg-ink px-2 py-1 text-bone">−5%</span>} />
                    <Option checked={method === 'card'} onSelect={() => setMethod('card')} title="Cartão de crédito" desc={`Até ${MAX_INSTALLMENTS}x sem juros`} right={<span className="mono text-[10px] text-stone-deep">VISA · MC · AMEX · ELO</span>} />
                    <Option checked={method === 'wallet'} onSelect={() => setMethod('wallet')} title="Apple Pay / Google Pay" desc="Pague com a carteira do seu dispositivo" />
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={method} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="pt-8">
                      {method === 'pix' && (
                        <div className="bg-mist p-6 text-[14px] leading-relaxed text-stone-deep">
                          O código PIX aparece na próxima tela, válido por 30 minutos. Você paga <span className="text-ink">{priceCents(total)}</span> e economiza {priceCents(pixOff)}.
                        </div>
                      )}
                      {method === 'card' && <CardForm card={card} setCard={(c) => (setCard(c), setErrors({}))} errors={errors} total={total} />}
                      {method === 'wallet' && (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <WalletButton kind="apple" onClick={place} />
                          <WalletButton kind="google" onClick={place} />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <Actions onBack={() => go(1)} onNext={place} busy={processing} nextLabel={`Finalizar pedido · ${priceCents(total)}`} />
                  <p className="mt-4 flex items-center gap-2 text-[12px] text-stone-deep">
                    <Lock size={12} strokeWidth={1.5} /> Dados protegidos com criptografia de ponta a ponta.
                  </p>
                </Step>
              )}

              {step === 3 && order && <Confirmation order={order} email={id.email} addr={addr} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-5">
          <Summary lines={lines} subtotal={order ? order.subtotal : store.subtotal} shipCost={order ? order.shipCost : shipCost} couponOff={order ? order.couponOff : couponOff} pixOff={order ? order.pixOff : pixOff} total={order ? order.total : total} coupon={coupon} setCoupon={setCoupon} locked={!!order} step={step} />
        </aside>
      </div>
    </Shell>
  );
}

function Shell({ step, onStep, children }: { step: number; onStep?: (n: number) => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="gutter flex h-16 items-center justify-between border-b border-line lg:h-[72px]">
        <Link href="/colecao/new" className="flex items-center gap-2 text-[12px] text-stone-deep">
          <ArrowLeft size={14} strokeWidth={1.25} /> <span className="hidden sm:inline">Voltar à loja</span>
        </Link>
        <Logo />
        <span className="flex items-center gap-2 text-[12px] text-stone-deep">
          <Lock size={13} strokeWidth={1.25} /> <span className="hidden sm:inline">Compra segura</span>
        </span>
      </header>
      {step >= 0 && (
        <nav aria-label="Etapas do checkout" className="gutter py-8 lg:py-12">
          <ol className="grid grid-cols-4 gap-2 lg:max-w-[58%]">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={s}>
                  <button onClick={() => onStep?.(i)} disabled={!done || step === 3} className="group block w-full text-left disabled:cursor-default" aria-current={current ? 'step' : undefined}>
                    <span className="relative block h-[2px] overflow-hidden bg-line">
                      <motion.span className="absolute inset-0 origin-left bg-ink" initial={false} animate={{ scaleX: done || current ? 1 : 0 }} transition={{ duration: 0.8, ease }} />
                    </span>
                    <span className={`mt-3 flex items-center gap-2 transition-colors ${current || done ? 'text-ink' : 'text-stone'}`}>
                      <span className="mono text-[10px]">{done ? <Check size={11} strokeWidth={2} /> : `0${i + 1}`}</span>
                      <span className="hidden text-[12px] sm:inline">{s}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[12px] sm:hidden">{STEPS[step]}</p>
        </nav>
      )}
      {children}
    </div>
  );
}

function Step({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="wd-wide text-[clamp(1.8rem,3vw,2.6rem)] font-[300] tracking-[-0.025em]">{title}</h1>
      <p className="mb-10 mt-2 text-[14px] text-stone-deep">{lead}</p>
      {children}
    </div>
  );
}

function Actions({ onBack, onNext, nextLabel, busy }: { onBack?: () => void; onNext: () => void; nextLabel: string; busy?: boolean }) {
  return (
    <div className="mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button onClick={onBack} className="link-u self-start text-[13px] text-stone-deep">
          Voltar
        </button>
      ) : (
        <span />
      )}
      <button onClick={onNext} disabled={busy} className="btn btn-dark h-14 w-full sm:w-auto">
        {busy ? (
          <span className="flex items-center gap-3">
            <span className="size-3.5 animate-spin rounded-full border border-bone/30 border-t-bone" /> Processando…
          </span>
        ) : (
          nextLabel
        )}
      </button>
    </div>
  );
}

function Option({ checked, onSelect, title, desc, right }: { checked: boolean; onSelect: () => void; title: string; desc: string; right?: React.ReactNode }) {
  return (
    <label className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors sm:p-5 ${checked ? 'border-ink' : 'border-line hover:border-stone'}`}>
      <input type="radio" checked={checked} onChange={onSelect} className="peer sr-only" />
      <span className="grid size-4 shrink-0 place-items-center rounded-full border border-ink/50 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2">
        <motion.span className="size-2 rounded-full bg-ink" initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ duration: 0.3 }} />
      </span>
      <span className="flex-1">
        <span className="block text-[14px]">{title}</span>
        <span className="block text-[12px] text-stone-deep">{desc}</span>
      </span>
      {right && <span className="shrink-0 text-[13px]">{right}</span>}
    </label>
  );
}

function WalletButton({ kind, onClick }: { kind: 'apple' | 'google'; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-12 items-center justify-center gap-1.5 bg-ink text-[15px] text-bone transition-opacity hover:opacity-85" aria-label={kind === 'apple' ? 'Pagar com Apple Pay (demonstração)' : 'Pagar com Google Pay (demonstração)'}>
      {kind === 'apple' ? (
        <>
          <svg viewBox="0 0 17 20" className="-mt-0.5 h-[17px] fill-current" aria-hidden>
            <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9C3.5 4.8 1.9 5.8 1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8 2.3-1.3 3.2-2.6c1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-2.9-4.4ZM11.5 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5Z" />
          </svg>
          <span className="font-[500] tracking-tight">Pay</span>
        </>
      ) : (
        <>
          <span className="font-[600] tracking-tight">G</span>
          <span className="font-[500] tracking-tight">Pay</span>
        </>
      )}
    </button>
  );
}

function CardForm({ card, setCard, errors, total }: { card: { number: string; name: string; expiry: string; cvv: string; installments: string }; setCard: (c: typeof card) => void; errors: Record<string, string>; total: number }) {
  const brand = cardBrand(card.number);
  const [flip, setFlip] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15rem] md:items-start">
      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Field className="col-span-2" label="Número do cartão" inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={(v) => setCard({ ...card, number: masks.card(v) })} error={errors.number} hint={brand || undefined} />
        <Field className="col-span-2" label="Nome impresso" autoComplete="cc-name" value={card.name} onChange={(v) => setCard({ ...card, name: v.toUpperCase() })} error={errors.cname} />
        <Field label="Validade" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.expiry} onChange={(v) => setCard({ ...card, expiry: masks.expiry(v) })} error={errors.expiry} />
        <div onFocus={() => setFlip(true)} onBlur={() => setFlip(false)}>
          <Field label="CVV" inputMode="numeric" autoComplete="cc-csc" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: masks.cvv(v) })} error={errors.cvv} />
        </div>
        <label className="relative col-span-2 block">
          <span className="eyebrow absolute left-0 top-0 text-stone-deep">Parcelas</span>
          <select value={card.installments} onChange={(e) => setCard({ ...card, installments: e.target.value })} className="field cursor-pointer appearance-none pt-6 text-[15px]">
            {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}x de {priceCents(total / n)} sem juros
              </option>
            ))}
          </select>
          <ChevronDown size={14} strokeWidth={1.25} className="pointer-events-none absolute bottom-4 right-0" />
        </label>
      </div>

      {/* Prévia do cartão */}
      <div className="hidden [perspective:1000px] md:block" aria-hidden>
        <motion.div className="relative aspect-[1.586] w-full [transform-style:preserve-3d]" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.7, ease }}>
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-ink p-4 text-bone [backface-visibility:hidden]">
            <div className="flex items-start justify-between">
              <span className="wd-exp text-[10px] font-[560] tracking-[0.3em]">NOMA</span>
              <span className="mono text-[9px] text-bone/70">{brand}</span>
            </div>
            <span className="chrome-dot block h-6 w-8 rounded-[3px] opacity-80" />
            <div>
              <p className="mono text-[12px] tracking-[0.08em]">{card.number || '•••• •••• •••• ••••'}</p>
              <div className="mt-2 flex justify-between text-[8px] uppercase tracking-[0.12em] text-bone/70">
                <span className="truncate pr-2">{card.name || 'Nome impresso'}</span>
                <span className="mono">{card.expiry || 'MM/AA'}</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-graphite [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mt-5 h-8 bg-ink" />
            <div className="mx-4 mt-4 flex h-7 items-center justify-end bg-bone/90 px-2">
              <span className="mono text-[11px] text-ink">{card.cvv || '•••'}</span>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-[11px] text-stone-deep">Teste com 4242 4242 4242 4242.</p>
      </div>
    </div>
  );
}

function Summary({ lines, subtotal, shipCost, couponOff, pixOff, total, coupon, setCoupon, locked, step }: { lines: Line[]; subtotal: number; shipCost: number; couponOff: number; pixOff: number; total: number; coupon: { code: string; applied: boolean; error: string }; setCoupon: (c: { code: string; applied: boolean; error: string }) => void; locked: boolean; step: number }) {
  const [open, setOpen] = useState(false);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const apply = () => {
    if (coupon.code.trim().toUpperCase() === 'NOMA10') setCoupon({ ...coupon, applied: true, error: '' });
    else setCoupon({ ...coupon, applied: false, error: 'Cupom inválido ou expirado.' });
  };

  const body = (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-4 py-4">
            <span className="relative h-24 w-[4.5rem] shrink-0 bg-mist">
              <Image {...img(l.product.images[0])} alt={l.product.name} sizes="72px" className="size-full object-cover" />
              <span className="mono absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-bone">{l.qty}</span>
            </span>
            <span className="flex min-w-0 flex-1 justify-between gap-3">
              <span>
                <span className="block text-[13px] leading-snug">{l.product.name}</span>
                <span className="block text-[12px] text-stone-deep">
                  {l.color} · Tam. {l.size}
                </span>
              </span>
              <span className="shrink-0 text-[13px] tabular-nums">{price(l.product.price * l.qty)}</span>
            </span>
          </li>
        ))}
      </ul>

      {!locked && (
        <div className="border-t border-line py-5">
          {coupon.applied ? (
            <p className="flex items-center justify-between text-[13px]">
              <span>
                Cupom <span className="mono">NOMA10</span> aplicado
              </span>
              <button onClick={() => setCoupon({ code: '', applied: false, error: '' })} className="link-u text-[12px] text-stone-deep">
                Remover
              </button>
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                apply();
              }}
              className="flex items-end gap-3"
            >
              <Field className="flex-1" label="Cupom de desconto" value={coupon.code} onChange={(v) => setCoupon({ ...coupon, code: v, error: '' })} error={coupon.error} hint="Experimente NOMA10" />
              <button type="submit" className="btn btn-line mb-5 h-11 px-5">
                Aplicar
              </button>
            </form>
          )}
        </div>
      )}

      <dl className="space-y-2.5 border-t border-line pt-5 text-[13px]">
        <Row label="Subtotal" value={price(subtotal)} />
        {couponOff > 0 && <Row label="Cupom NOMA10" value={`− ${price(couponOff)}`} />}
        {pixOff > 0 && <Row label="Desconto PIX (5%)" value={`− ${priceCents(pixOff)}`} />}
        <Row label="Frete" value={step < 1 && !locked ? 'Calculado na entrega' : shipCost === 0 ? 'Grátis' : price(shipCost)} />
        <div className="flex items-baseline justify-between border-t border-line pt-4 text-[16px]">
          <dt>Total</dt>
          <dd className="tabular-nums">{priceCents(total)}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <div className="lg:sticky lg:top-8">
      {/* Mobile: resumo recolhível */}
      <div className="border-y border-line lg:hidden">
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-[13px]">
          <span className="flex items-center gap-2">
            {open ? 'Ocultar' : 'Ver'} resumo ({count} {count === 1 ? 'item' : 'itens'})
            <ChevronDown size={14} strokeWidth={1.25} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </span>
          <span className="tabular-nums">{priceCents(total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
              <div className="pb-6">{body}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden bg-mist/60 p-8 lg:block">
        <p className="wd-exp mb-2 text-[11px] font-[500] uppercase tracking-[0.18em]">Resumo do pedido</p>
        {body}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-deep">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function Confirmation({ order, email, addr }: { order: { number: string; total: number; method: Method; ship: Ship; installments: string }; email: string; addr: { street: string; number: string; city: string; uf: string } }) {
  const [copied, setCopied] = useState(false);
  const [left, setLeft] = useState(30 * 60);
  const code = useMemo(() => `00020126580014BR.GOV.BCB.PIX0136noma-${order.number.toLowerCase()}5204000053039865802BR5904NOMA6009SAO PAULO62070503***6304A1B2`, [order.number]);
  useEffect(() => {
    if (order.method !== 'pix') return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [order.method]);
  const eta = new Date(Date.now() + (order.ship === 'express' ? 2 : order.ship === 'pickup' ? 1 : 6) * 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

  return (
    <div>
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }} className="grid size-12 place-items-center rounded-full bg-ink text-bone">
        <Check size={20} strokeWidth={1.5} />
      </motion.span>
      <p className="eyebrow mt-8 text-stone-deep">Pedido {order.number}</p>
      <h1 className="wd-wide mt-3 text-[clamp(2rem,3.6vw,3.2rem)] font-[280] leading-[1.02] tracking-[-0.03em]">
        {order.method === 'pix' ? 'Falta só o PIX.' : 'Pedido confirmado.'}
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-stone-deep">
        {order.method === 'pix'
          ? 'Pague com o código abaixo para confirmar. Assim que o pagamento cair, você recebe a confirmação por e-mail.'
          : `Pagamento aprovado${order.method === 'card' ? ` em ${order.installments}x sem juros` : ''}. Enviamos os detalhes para ${email || 'seu e-mail'}.`}
      </p>

      {order.method === 'pix' && (
        <div className="mt-10 grid grid-cols-1 gap-8 border border-line p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <FakeQr seed={order.number} />
          <div className="min-w-0">
            <p className="text-[13px] text-stone-deep">Valor</p>
            <p className="text-[22px] tabular-nums">{priceCents(order.total)}</p>
            <p className="mono mt-2 text-[11px] text-stone-deep">
              Expira em {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
            </p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(code).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 2400);
              }}
              className="btn btn-dark mt-5 w-full"
            >
              {copied ? <><Check size={14} /> Código copiado</> : <><Copy size={14} strokeWidth={1.5} /> Copiar código PIX</>}
            </button>
          </div>
        </div>
      )}

      <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="eyebrow text-stone-deep">{order.ship === 'pickup' ? 'Retirada' : 'Entrega'}</dt>
          <dd className="mt-2">{order.ship === 'pickup' ? 'Showroom NOMA · Bom Retiro, São Paulo' : `${addr.street}, ${addr.number} — ${addr.city}/${addr.uf}`}</dd>
        </div>
        <div>
          <dt className="eyebrow text-stone-deep">Previsão</dt>
          <dd className="mt-2">Até {eta}</dd>
        </div>
      </dl>
      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/colecao/new" className="btn btn-dark">Continuar comprando</Link>
        <Link href="/conta" className="btn btn-line">Acompanhar pedido</Link>
      </div>
    </div>
  );
}

/** QR ilustrativo e determinístico — não é um código PIX válido. */
function FakeQr({ seed }: { seed: string }) {
  const N = 25;
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const finder = (x: number, y: number) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const inFinder = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
      const dx = x - fx, dy = y - fy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    }
    return false;
  };
  const cells: [number, number][] = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (finder(x, y) ? inFinder(x, y) : rnd() > 0.52) cells.push([x, y]);
  return (
    <svg viewBox={`-2 -2 ${N + 4} ${N + 4}`} className="size-40 bg-white" role="img" aria-label="QR Code PIX ilustrativo">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#0b0b0a" />
      ))}
    </svg>
  );
}
