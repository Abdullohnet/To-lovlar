'use client'

import { useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { jsPDF } from 'jspdf'

const plans = [
  {
    name: 'Bepul tarif',
    price: 'Bepul',
    description: 'Boshlash uchun qulay',
    features: ['Oyiga 2 ta transfer', 'Asosiy tranzaksiya tarixi', 'Elektron pochta orqali yordam', 'Cheklangan qo‘llab-quvvatlash', 'Asosiy xavfsizlik funksiyalari'],
  },
  {
    name: 'Standart tarif',
    price: '$9.99',
    description: 'Faol foydalanuvchilar uchun',
    features: ['Cheksiz transferlar', 'Eksport imkoniyatli tranzaksiya tarixi', 'Ustuvor elektron yordam', 'Kengaytirilgan qo‘llab-quvvatlash', 'Ilg‘or xavfsizlik funksiyalari'],
    featured: true,
  },
  {
    name: 'Premium tarif',
    price: '$19.99',
    description: 'Biznes va jamoalar uchun',
    features: ['Ustuvor qayta ishlash bilan cheksiz transferlar', 'Keng qamrovli tranzaksiya tahlili', '24/7 ustuvor yordam', 'To‘liq mijozlar qo‘llab-quvvatlashi', 'Kuchaytirilgan xavfsizlik funksiyalari'],
  },
]

export default function Page() {
  const [yearly, setYearly] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [showClose, setShowClose] = useState(true)
  const [contactSent, setContactSent] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 })
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 })
  const magnetRef = useRef<HTMLElement>(null)

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY })
    const magnet = magnetRef.current
    if (!magnet) return
    const bounds = magnet.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY)
    const pullRadius = 110
    if (distance < pullRadius) {
      const strength = (pullRadius - distance) / pullRadius
      setMagnetOffset({ x: (event.clientX - centerX) * strength * 0.55, y: (event.clientY - centerY) * strength * 0.55 })
    } else {
      setMagnetOffset({ x: 0, y: 0 })
    }
  }

  const magnetize = (event: MouseEvent<HTMLElement>) => {
    if (!showClose) return
    const element = event.currentTarget
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.22
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.22
    element.style.transform = `translate(${x}px, ${y}px)`
  }

  const releaseMagnet = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.transform = 'translate(0, 0)'
  }

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.querySelector(event.currentTarget.getAttribute('href') ?? '')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDownload = () => {
    const pdf = new jsPDF()
    const ink = darkMode ? [245, 247, 255] : [16, 24, 48]
    const muted = darkMode ? [190, 201, 230] : [76, 88, 120]
    const base = darkMode ? [7, 12, 35] : [241, 246, 255]

    pdf.setFillColor(...base)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.setFillColor(37, 99, 235)
    pdf.ellipse(25, 72, 55, 68, 'F')
    pdf.setFillColor(99, 62, 190)
    pdf.ellipse(155, 125, 62, 78, 'F')
    pdf.setFillColor(28, 160, 220)
    pdf.ellipse(70, 225, 78, 45, 'F')

    pdf.setTextColor(...ink)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.text('TOLOVLAR / 01', 16, 18)
    pdf.text('TARIFLAR', 194, 18, { align: 'right' })
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...muted)
    pdf.text('SODDA. TEZ. ISHONCHLI.', 14, 148, { angle: 90 })
    pdf.text('GLASS EDITION', 196, 148, { angle: 90, align: 'right' })

    pdf.setFillColor(darkMode ? 22 : 255, darkMode ? 32 : 255, darkMode ? 68 : 255)
    pdf.roundedRect(22, 43, 166, 202, 10, 10, 'F')
    pdf.setDrawColor(darkMode ? 100 : 210, darkMode ? 130 : 225, 255)
    pdf.setLineWidth(0.7)
    pdf.roundedRect(22, 43, 166, 202, 10, 10, 'S')

    pdf.setTextColor(...ink)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(23)
    pdf.text('Tolovlar', 34, 68)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...muted)
    pdf.text('Ishingiz uchun sodda va ishonchli tariflar.', 34, 78)

    let y = 98
    plans.forEach((plan, index) => {
      pdf.setFillColor(index === 1 ? 221 : 245, index === 1 ? 235 : 249, 255)
      pdf.roundedRect(31, y - 8, 148, 28, 5, 5, 'F')
      pdf.setTextColor(...ink)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text(plan.name, 38, y + 1)
      pdf.setTextColor(35, 91, 210)
      pdf.text(`${plan.price}${plan.price !== 'Bepul' ? ' /oy' : ''}`, 172, y + 1, { align: 'right' })
      pdf.setTextColor(...muted)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      pdf.text(plan.features[0] ?? plan.description, 38, y + 10)
      y += 37
    })

    pdf.setDrawColor(190, 210, 240)
    pdf.line(34, 218, 176, 218)
    pdf.setTextColor(...muted)
    pdf.setFontSize(8)
    pdf.text('Telegram: @xswnn', 34, 230)
    pdf.text('Yaxshi tanlov. Yaxshi tolovlar.', 34, 238)
    pdf.save('tolovlar-haqida.pdf')
  }

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '')
    const message = String(form.get('message') ?? '')
    const body = encodeURIComponent(`To‘lovlar saytidan yangi murojaat:\n\nIsm: ${name}\n\n${message}`)
    window.open(`https://t.me/xswnn?text=${body}`, '_blank', 'noopener,noreferrer')
    setContactSent(true)
    event.currentTarget.reset()
  }

  return (
    <main onMouseMove={handlePointerMove} className={`relative min-h-screen w-full overflow-x-hidden px-4 py-4 sm:px-5 sm:py-5 transition-[background-color,color] duration-700 ease-out before:pointer-events-none before:absolute before:inset-0 before:transition-opacity before:duration-700 before:content-[''] ${darkMode ? 'bg-[#070912] text-white before:opacity-100 before:bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.18),transparent_22%),radial-gradient(circle_at_12%_55%,rgba(38,112,255,.2),transparent_30%),radial-gradient(circle_at_88%_72%,rgba(139,72,255,.18),transparent_28%)]' : 'bg-[#f3f7ff] text-black before:opacity-100 before:bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.9),transparent_24%),radial-gradient(circle_at_12%_55%,rgba(38,112,255,.18),transparent_30%),radial-gradient(circle_at_88%_72%,rgba(139,72,255,.14),transparent_28%)]'}`}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 hidden sm:block">
        <span
          aria-hidden="true"
          className={`absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-[left,top,opacity,background-color,box-shadow] duration-200 ease-out ${showClose ? 'opacity-100' : 'opacity-0'} ${darkMode ? 'bg-white/75 shadow-[0_0_14px_rgba(255,255,255,.65)]' : 'bg-black/55 shadow-[0_0_14px_rgba(0,0,0,.22)]'}`}
          style={{ left: cursorPosition.x, top: cursorPosition.y }}
        />
      </div>
      <nav className={`relative z-10 mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-full border px-2 py-2 text-[8px] sm:w-fit sm:flex-nowrap sm:gap-5 sm:px-3 sm:py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_0_32px_rgba(65,120,255,.16)] backdrop-blur-2xl transition-[background-color,border-color,color] duration-700 ease-out ${darkMode ? 'border-white/25 bg-white/[0.08] text-white/55' : 'border-black/10 bg-black/[0.04] text-black/50'}`}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          onMouseMove={magnetize}
          onMouseLeave={releaseMagnet}
          aria-label={darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}
          className={`flex size-5 items-center justify-center rounded-full text-[10px] transition-[transform,background-color,color] duration-500 ${darkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}
        >{darkMode ? '☼' : '◐'}</button>
        <button
          ref={magnetRef}
          aria-label="Yopish"
          onClick={() => setShowClose(false)}
          onMouseMove={magnetize}
          onMouseLeave={releaseMagnet}
          className={`hidden size-5 items-center justify-center rounded-full text-[11px] transition-[transform,border-color,background-color,box-shadow,color] duration-500 ease-out sm:flex ${showClose ? (darkMode ? 'border border-white/30 bg-white/[0.06] text-white/70 shadow-[0_0_14px_rgba(255,255,255,.12)]' : 'border border-black/15 bg-black/[0.05] text-black/65 shadow-[0_0_14px_rgba(0,0,0,.08)]') : 'border border-transparent bg-transparent text-current shadow-none'}`}
          style={{ transform: `translate(${magnetOffset.x}px, ${magnetOffset.y}px)` }}
        >×</button>
        <a className={`transition-transform duration-150 ease-out ${darkMode ? 'text-white' : 'text-black'}`} onMouseMove={magnetize} onMouseLeave={releaseMagnet} href="#home">Bosh sahifa</a>
        <a className="transition-transform duration-150 ease-out" onMouseMove={magnetize} onMouseLeave={releaseMagnet} href="#pricing">Tariflar</a>
        <a className="transition-transform duration-150 ease-out" onMouseMove={magnetize} onMouseLeave={releaseMagnet} href="#faq">FAQ</a>
        <a className="transition-transform duration-150 ease-out" onClick={scrollToSection} onMouseMove={magnetize} onMouseLeave={releaseMagnet} href="#contact">Aloqa</a>
        <button onClick={handleDownload} onMouseMove={magnetize} onMouseLeave={releaseMagnet} className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[7px] font-medium sm:px-3 sm:text-[8px] transition-[transform,background-color,color] duration-500 ease-out ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>Yuklab olish</button>
      </nav>

      <section id="home" className="relative z-0 mx-auto max-w-6xl pt-8 text-center">
        <p className={`text-[10px] uppercase tracking-[0.42em] ${darkMode ? 'text-white/45' : 'text-black/45'}`}>Oddiy. Tez. Ishonchli.</p>
        <p className={`mx-auto mt-3 max-w-md text-sm ${darkMode ? 'text-white/45' : 'text-black/50'}`}>Siz uchun mos tarifni tanlang va moliyaviy erkinlikni bugunoq boshlang.</p>
        <h1 className={`relative mt-8 -translate-y-[10%] bg-clip-text text-[clamp(4.5rem,22vw,11rem)] font-semibold leading-[.72] tracking-[-0.09em] text-transparent transition-[filter] duration-700 ${darkMode ? 'bg-gradient-to-b from-white from-0% via-white via-48% to-white/10 to-100% drop-shadow-[0_0_34px_rgba(255,255,255,.2)]' : 'bg-gradient-to-b from-black from-0% via-black via-48% to-black/10 to-100% drop-shadow-[0_0_24px_rgba(0,0,0,.12)]'}`}>To‘lovlar</h1>
      </section>

      <section id="pricing" className="relative z-10 mx-auto -mt-2 max-w-6xl">
        <div className="grid gap-3 sm:gap-2.5 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`group relative overflow-hidden rounded-2xl border px-5 pb-5 pt-5 backdrop-blur-2xl transition-[transform,background-color,border-color,box-shadow,color] duration-700 ease-[cubic-bezier(.16,1,.3,1)] will-change-transform hover:-translate-y-1.5 hover:scale-[1.012] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.32),0_24px_60px_rgba(0,0,0,.2)] ${darkMode ? 'border-white/25 bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-blue-400/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.34),0_18px_50px_rgba(0,0,0,.24)] hover:border-white/40 hover:bg-white/[0.16]' : 'border-white/80 bg-gradient-to-br from-white/85 via-white/60 to-blue-100/55 text-black shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_18px_50px_rgba(62,82,128,.16)] hover:border-white hover:bg-white/80'} ${plan.featured ? 'md:-mt-3 md:mb-3' : ''}`}>
              {plan.featured && <div className={`absolute right-4 top-4 rounded-full border px-2 py-1 text-[8px] uppercase tracking-wider backdrop-blur-md ${darkMode ? 'border-white/25 bg-white/[0.12] text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,.2)]' : 'border-black/10 bg-white/70 text-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,.8)]'}`}>Tavsiya etiladi</div>}
              <p className={`text-[10px] ${darkMode ? 'text-white/50' : 'text-black/50'}`}>{plan.name}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <h2 className="text-3xl font-medium tracking-tight">{plan.price}</h2>
                {plan.price !== 'Bepul' && <span className="text-sm text-white/50">/oy</span>}
              </div>
              <p className={`mt-1 text-[10px] ${darkMode ? 'text-white/35' : 'text-black/45'}`}>{plan.description}</p>
              <div className={`my-5 h-px ${darkMode ? 'bg-white/10' : 'bg-black/10'}`} />
              <ul className="flex min-h-40 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2 text-[10px] leading-4 ${darkMode ? 'text-white/55' : 'text-black/60'}`}><span className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border text-[8px] ${darkMode ? 'border-white/20 text-white' : 'border-black/15 text-black'}`}>✓</span>{feature}</li>
                ))}
              </ul>
              <button className={`mt-5 w-full rounded-full border py-2.5 text-[10px] font-medium transition-[background-color,color,border-color] duration-500 hover:bg-white hover:text-black ${plan.featured ? (darkMode ? 'border-white bg-white text-black' : 'border-black bg-black text-white') : (darkMode ? 'border-white/20 bg-black text-white' : 'border-black/15 bg-white/55 text-black')}`}>Boshlash</button>
            </article>
          ))}
        </div>
        <button onClick={() => setYearly(!yearly)} className={`mx-auto mt-5 flex items-center gap-2 text-[10px] ${darkMode ? 'text-white/50' : 'text-black/55'}`} aria-pressed={yearly}>
          <span className={`flex h-3.5 w-6 items-center rounded-full border p-0.5 ${darkMode ? 'border-white/25' : 'border-black/15'} ${yearly ? 'justify-end bg-white' : (darkMode ? 'justify-start bg-white/10' : 'justify-start bg-black/10')}`}><span className={`size-2 rounded-full ${yearly ? 'bg-black' : 'bg-white/60'}`} /></span>
          Yillik to‘lov {yearly ? '(20% tejash)' : ''}
        </button>
      </section>

      <section id="faq" className={`relative z-10 mx-auto mt-20 max-w-xl border-t pt-8 text-center ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
        <p className={`text-[10px] uppercase tracking-[0.3em] ${darkMode ? 'text-white/35' : 'text-black/40'}`}>Savollaringiz bormi?</p>
        <h3 className="mt-3 text-2xl font-medium">Sizga yordam berishga tayyormiz.</h3>
        <p className={`mt-2 text-xs ${darkMode ? 'text-white/40' : 'text-black/50'}`}>Tariflar yoki xizmatlar haqida batafsil ma’lumot olish uchun biz bilan bog‘laning.</p>
        <div id="contact" className="mt-7 scroll-mt-8 grid gap-3 text-left sm:gap-4 sm:grid-cols-[.8fr_1.2fr]">
          <div className={`rounded-2xl border p-5 backdrop-blur-xl ${darkMode ? 'border-white/10 bg-white/[0.05]' : 'border-black/10 bg-white/55'}`}>
            <p className={`text-[9px] uppercase tracking-[0.25em] ${darkMode ? 'text-white/40' : 'text-black/45'}`}>To‘g‘ridan-to‘g‘ri</p>
            <div className="mt-4 grid gap-2">
              <a href="https://t.me/xswnn" target="_blank" rel="noreferrer" className={`rounded-xl border px-4 py-3 text-xs transition-colors ${darkMode ? 'border-white/10 bg-white/[0.04] hover:bg-white/10' : 'border-black/10 bg-white/55 hover:bg-white/80'}`}>Telegram <span className="float-right opacity-50">@xswnn ↗</span></a>
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className={`rounded-2xl border p-5 backdrop-blur-xl ${darkMode ? 'border-white/10 bg-white/[0.05]' : 'border-black/10 bg-white/55'}`}>
            <p className={`text-[9px] uppercase tracking-[0.25em] ${darkMode ? 'text-white/40' : 'text-black/45'}`}>Xabar yuborish</p>
            <div className="mt-4 grid gap-2">
              <input required name="name" placeholder="Ismingiz" aria-label="Ismingiz" className={`rounded-xl border px-4 py-3 text-xs outline-none transition-colors ${darkMode ? 'border-white/10 bg-black/20 placeholder:text-white/30 focus:border-white/35' : 'border-black/10 bg-white/60 placeholder:text-black/35 focus:border-black/25'}`} />
              <textarea required name="message" rows={3} placeholder="Xabaringiz" aria-label="Xabaringiz" className={`resize-none rounded-xl border px-4 py-3 text-xs outline-none transition-colors ${darkMode ? 'border-white/10 bg-black/20 placeholder:text-white/30 focus:border-white/35' : 'border-black/10 bg-white/60 placeholder:text-black/35 focus:border-black/25'}`} />
              <button type="submit" className={`rounded-xl px-4 py-3 text-xs font-medium transition-transform hover:scale-[1.01] ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>{contactSent ? 'Telegram ochildi' : 'Telegramga yuborish'}</button>
            </div>
          </form>
        </div>
      </section>
      <footer className={`mx-auto mt-14 max-w-6xl border-t py-6 text-center text-[10px] ${darkMode ? 'border-white/10 text-white/25' : 'border-black/10 text-black/35'}`}>© 2026 To‘lovlar. Barcha huquqlar himoyalangan.</footer>
    </main>
  )
}
