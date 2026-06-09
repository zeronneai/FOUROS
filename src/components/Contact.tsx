import { useState, type FormEvent } from 'react'
import { useI18n } from '../lib/i18n'
import { submitLead, supabase } from '../lib/supabase'
import { INSTAGRAM_URL, whatsappLink } from '../lib/site'
import { Eyebrow, Reveal } from './primitives'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const { t, lang } = useI18n()
  const [name, setName] = useState('')
  const [piece, setPiece] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')

    // Compose a WhatsApp message either way — works with or without Supabase.
    const message =
      lang === 'es'
        ? `Hola, soy ${name}. Me interesa: ${piece}. Contacto: ${contact}.`
        : `Hi, I'm ${name}. Interested in: ${piece}. Contact: ${contact}.`

    if (supabase) {
      const ok = await submitLead({ name, piece, contact, lang })
      setStatus(ok ? 'success' : 'error')
      if (ok) {
        setName('')
        setPiece('')
        setContact('')
      }
    } else {
      // No backend configured → hand the lead straight to WhatsApp.
      window.open(whatsappLink(message), '_blank', 'noopener')
      setStatus('success')
    }
  }

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-hairline">
      <div className="container-editorial grid grid-cols-1 gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8">
        {/* Left: pitch + direct CTAs */}
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow gold>{t('contact.eyebrow')}</Eyebrow>
            <h2 className="mt-4 max-w-md text-balance font-display text-[clamp(2.25rem,6vw,4.5rem)] font-[650] leading-[0.95] tracking-tightest text-bone">
              {t('contact.title')}
            </h2>
            <p className="mt-6 max-w-md text-pretty font-body text-[15px] leading-relaxed tracking-tighter text-muted">
              {t('contact.body')}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={whatsappLink(
                  lang === 'es'
                    ? 'Hola, me gustaría reservar una pieza.'
                    : "Hi, I'd like to reserve a piece.",
                )}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 border border-gold/40 px-6 py-3.5 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 ease-editorial hover:border-gold hover:text-gold-light"
              >
                {t('contact.whatsapp')}
                <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">&rarr;</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="link-underline font-body text-[12px] uppercase tracking-[0.2em] text-muted hover:text-bone"
              >
                {t('contact.instagram')}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: minimal form */}
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal delay={0.1}>
            <p className="mb-8 font-body text-[12px] uppercase tracking-[0.2em] text-muted">
              {t('contact.or')}
            </p>
            <form onSubmit={onSubmit} className="flex flex-col gap-7">
              <Field
                label={t('contact.form.name')}
                value={name}
                onChange={setName}
                autoComplete="name"
                required
              />
              <Field
                label={t('contact.form.piece')}
                value={piece}
                onChange={setPiece}
                placeholder={t('contact.form.piece.placeholder')}
                required
              />
              <Field
                label={t('contact.form.contact')}
                value={contact}
                onChange={setContact}
                required
              />

              <div className="mt-2 flex items-center gap-5">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group inline-flex items-center gap-3 border border-gold/40 px-6 py-3.5 font-body text-[12px] uppercase tracking-[0.2em] text-bone transition-colors duration-300 ease-editorial hover:border-gold hover:text-gold-light disabled:opacity-50"
                >
                  {status === 'sending'
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                  <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:translate-x-1">&rarr;</span>
                </button>

                {status === 'success' && (
                  <span className="font-body text-[12px] tracking-tighter text-gold-light">
                    {t('contact.form.success')}
                  </span>
                )}
                {status === 'error' && (
                  <span className="font-body text-[12px] tracking-tighter text-sunset-rose">
                    {t('contact.form.error')}
                  </span>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <label className="group block">
      <span className="eyebrow mb-2 block">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full border-b border-hairline bg-transparent py-3 font-body text-[15px] tracking-tighter text-bone placeholder:text-muted/60 transition-colors duration-300 ease-editorial focus:border-gold focus:outline-none"
      />
    </label>
  )
}
