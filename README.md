# CafeNest

A minimal, coffee-and-mocha-green themed café website with Home, About, Shop, and Cart pages.

## Stack
- React 18 + Vite
- Tailwind CSS (custom coffee / mocha-green palette)
- React Router (multi-page)
- Cart state via Context API, persisted to localStorage

## Run locally
```bash
npm install
npm start
```
Open the printed local URL (usually http://localhost:5173).

## Build for production
```bash
npm run build
npm run preview
```

## Where things live
- `src/data/products.js` — edit menu items, prices, and categories here
- `src/pages/` — Home, About, Shop, Cart
- `src/components/ProductCard.jsx` — the quantity stepper card used in Shop and Home
- `src/context/CartContext.jsx` — add/remove/increment/decrement cart logic
- `tailwind.config.js` — color palette (cream, espresso, coffee, mocha-green, sand) and fonts

## Notes
- The Shop and Home cards use a simple line-art cup icon instead of stock photos — swap in real product photography by editing `ProductCard.jsx` and `Home.jsx`.
- Checkout button on the Cart page is a placeholder — wire it up to your payment/order flow when ready.
