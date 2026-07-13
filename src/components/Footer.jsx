import React from 'react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-espresso text-cream mt-24">
      <div className="twig-divider" style={{ filter: 'invert(1)', opacity: 0.5 }} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="CafeNest logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-display text-xl">cafenest</span>
          </div>
          <p className="text-cream/70 text-sm max-w-xs">
            Coffee, comfort and connection — a quiet corner for slow mornings and long conversations.
          </p>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-[0.16em] text-sand mb-3">Visit</h4>
          <p className="text-cream/70 text-sm leading-relaxed">
            12 Maple Lane, Dehradun<br />
            Open daily · 8am – 9pm
          </p>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-[0.16em] text-sand mb-3">Say hello</h4>
          <p className="text-cream/70 text-sm leading-relaxed">
            hello@cafenest.com<br />
            +91 98765 43210
          </p>
        </div>
      </div>
      <div className="text-center text-cream/40 text-xs pb-6">
        © {new Date().getFullYear()} CafeNest. All rights reserved.
      </div>
    </footer>
  )
}
