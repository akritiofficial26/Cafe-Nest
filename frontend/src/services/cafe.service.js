/**
 * Where and when the café is. Single source of truth — the Footer and the
 * Contact page both read from here, so an address or phone change never has to
 * be made twice (and can't be updated in one place and missed in the other).
 */
export const CAFE_INFO = {
  address: {
    line1: '12 Maple Lane, Dehradun',
    line2: 'Near the old market square',
  },
  hours: [
    { days: 'Monday – Friday', time: '8am – 9pm' },
    { days: 'Saturday – Sunday', time: '9am – 10pm' },
  ],
  email: 'hello@cafenest.com',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
}

export default CAFE_INFO
