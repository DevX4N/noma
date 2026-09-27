'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { Field } from '@/components/checkout/fields';
import { Lines } from '@/components/reveal';
import { imgFill } from '@/lib/img';

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Digite um e-mail válido, como nome@email.com.');
    setSent(true);
  };

  return (
    <div className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-2">
      <div className="gutter flex flex-col justify-center pb-24 pt-32 lg:px-[8vw]">
        <p className="eyebrow text-stone-deep">Minha conta</p>
        <h1 className="wd-exp mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-[250] uppercase leading-[0.92] tracking-[-0.03em]">
          <Lines animateOnMount lines={mode === 'login' ? ['Welcome', 'back'] : ['Join', 'NOMA']} key={mode} />
        </h1>
        <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-stone-deep">
          {mode === 'login' ? 'Enviamos um link de acesso para o seu e-mail. Sem senha para lembrar.' : 'Acompanhe pedidos, salve favoritos em qualquer dispositivo e receba acesso antecipado aos lançamentos.'}
        </p>

        <div className="mt-12 max-w-sm">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status">
                <p className="text-[15px]">Link enviado para {email}.</p>
                <p className="mt-2 text-[13px] text-stone-deep">Abra o e-mail no mesmo dispositivo para entrar. O link expira em 15 minutos.</p>
                <button onClick={() => setSent(false)} className="link-u mt-6 text-[13px]">
                  Usar outro e-mail
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} noValidate>
                <Field label="E-mail" type="email" autoComplete="email" value={email} onChange={(v) => (setEmail(v), setError(''))} error={error} />
                <button type="submit" className="btn btn-dark mt-8 w-full">
                  {mode === 'login' ? 'Enviar link de acesso' : 'Criar conta'}
                </button>
                <p className="mt-6 text-[13px] text-stone-deep">
                  {mode === 'login' ? 'Primeira vez aqui? ' : 'Já tem conta? '}
                  <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="link-u text-ink">
                    {mode === 'login' ? 'Criar conta' : 'Entrar'}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="relative hidden bg-mist lg:block">
        <Image {...imgFill('/images/e/look-3.webp')} alt="" fill sizes="50vw" className="object-cover" priority />
      </div>
    </div>
  );
}
