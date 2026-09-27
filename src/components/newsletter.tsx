'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState('error');
    setState('done');
  };

  return (
    <section aria-labelledby="nl-title" className="gutter border-t border-line py-24 lg:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-stone-deep">Newsletter</p>
        <h2 id="nl-title" className="title wd-wide mt-5">
          Private Access
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-[15px] text-stone-deep">Novas coleções, lançamentos limitados e acesso antecipado.</p>

        <div className="relative mx-auto mt-12 max-w-lg">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'done' ? (
              <motion.p key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border-b border-ink pb-4 text-[15px]" role="status">
                Pronto. Você receberá o próximo lançamento antes de todo mundo.
              </motion.p>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -8 }} onSubmit={submit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                <label className="relative flex-1 text-left">
                  <span className="eyebrow absolute left-0 top-0 text-stone-deep">Seu e-mail</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === 'error') setState('idle');
                    }}
                    aria-invalid={state === 'error'}
                    aria-describedby="nl-error"
                    className="field pt-6"
                    placeholder="nome@email.com"
                  />
                </label>
                <button type="submit" className="btn btn-dark shrink-0">
                  Join NOMA
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <p id="nl-error" className="mt-3 h-4 text-left text-[12px] text-danger" role="alert">
            {state === 'error' && 'Digite um e-mail válido, como nome@email.com.'}
          </p>
          <p className="mt-2 text-[11px] text-stone">Sem spam. Cancele quando quiser.</p>
        </div>
      </div>
    </section>
  );
}
