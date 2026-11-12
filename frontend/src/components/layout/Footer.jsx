import React from "react";
import logoImg from '../../assets/updated logo.png'
import { CAFE_INFO } from '../../services/cafe.service'

export default function Footer() {
  return (
    <footer
      className="bg-espresso text-cream mt-24 border-t border-white/10"
    >
      <div
        className="twig-divider"
        style={{ filter: "invert(1)", opacity: 0.5 }}
      />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-8 items-start">
        <div className="self-start">
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logoImg}
              alt="CafeNest logo"
              className="h-14 w-14 object-contain -translate-y-2"
            />
            <span className="font-display text-2xl font-semibold">
              CafeNest
            </span>
          </div>

          <p className="text-cream/70 text-sm leading-7 max-w-sm">
            Coffee, comfort and connection — a quiet corner for slow mornings,
            warm pastries, and long conversations with friends and neighbors.
          </p>
        </div>

        {/* Visit Us */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.16em] text-sand font-semibold mb-4">
            Visit Us
          </h4>

          <p className="text-cream/70 text-sm leading-7">
            {CAFE_INFO.address.line1}
            <br />
            {CAFE_INFO.address.line2}
          </p>
        </div>

        {/* Hours */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.16em] text-sand font-semibold mb-4">
            Hours
          </h4>

          <p className="text-cream/70 text-sm leading-7">
            {CAFE_INFO.hours.map((slot, index) => (
              <React.Fragment key={slot.days}>
                {slot.days}: {slot.time}
                {index < CAFE_INFO.hours.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.16em] text-sand font-semibold mb-4">
            Say Hello
          </h4>

          <div className="space-y-2 text-sm text-cream/70">
            <a
              href={`mailto:${CAFE_INFO.email}`}
              className="block hover:text-sand transition-colors"
            >
              {CAFE_INFO.email}
            </a>

            <a
              href={CAFE_INFO.phoneHref}
              className="block hover:text-sand transition-colors"
            >
              {CAFE_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mx-5 sm:mx-8">
        <div className="text-center text-cream/40 text-xs py-6">
          © {new Date().getFullYear()} CafeNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
