import React from 'react'

const milestones = [
  { year: '2019', text: 'Started as a two-table stall roasting beans in a rented kitchen.' },
  { year: '2021', text: 'Opened the first CafeNest room, seating twelve on mismatched chairs.' },
  { year: '2024', text: 'Began sourcing direct-trade beans from three family farms.' },
  { year: '2026', text: 'Still small, still slow, now with a menu people ask us to bring online.' },
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <p className="uppercase text-xs tracking-[0.2em] text-mocha-green font-semibold mb-4">Our story</p>
      <h1 className="font-display text-4xl text-espresso mb-6">Built like a nest, one twig at a time.</h1>
      <p className="text-espresso-light/90 leading-relaxed max-w-2xl mb-6">
        CafeNest began with a simple complaint: coffee shops had gotten loud and fast, and we missed
        the version that let you stay a while. So we built a room that felt like the inside of a nest —
        warm, layered, a little imperfect — and filled it with coffee we'd actually stand behind.
      </p>
      <p className="text-espresso-light/90 leading-relaxed max-w-2xl mb-14">
        Every cup is pulled to order. Every pastry is baked before sunrise. And every table is yours
        for as long as you need it.
      </p>

      <div className="twig-divider mb-14" />

      <h2 className="font-display text-2xl text-espresso mb-8">How we got here</h2>
      <div className="space-y-8">
        {milestones.map((m) => (
          <div key={m.year} className="flex gap-6">
            <span className="font-display text-xl text-coffee-dark w-16 shrink-0">{m.year}</span>
            <p className="text-espresso-light/85 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
