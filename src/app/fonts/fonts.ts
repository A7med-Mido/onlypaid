import localFont from 'next/font/local';

export const kabel = localFont({
  src: './kabel/Kabel-Black-Regular.otf',
  variable: '--font-kabel',
  display: 'swap',
  weight: '100 900',
  preload: true
});



export const obv = localFont({
  src: [
    // Thin (~100–150)
    {
      path: './obv/fonnts.com-Obviously_Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './obv/fonnts.com-Obviously_Extd_Thin.otf',
      weight: '200',
      style: 'normal',
    },

    // Light (~300)
    {
      path: './obv/fonnts.com-Obviously_Lght.otf',
      weight: '300',
      style: 'normal',
    },

    // Regular / Normal (~400)
    {
      path: './obv/fonnts.com-Obviously.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './obv/fonnts.com-Obviously_Extd.otf',
      weight: '500',
      style: 'normal',
    },

    // Medium (~500)
    {
      path: './obv/fonnts.com-Obviously_Medi.otf',
      weight: '600',
      style: 'normal',
    },

    // SemiBold (~600)
    {
      path: './obv/fonnts.com-Obviously_Semi.otf',
      weight: '700',
      style: 'normal',
    },

    // Super / ExtraBold / Black (~800–900+)
    {
      path: './obv/fonnts.com-Obviously_Extd_Supr.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-obv',   // ← perfect for Tailwind + CSS vars
  display: 'swap',                // prevents invisible text (FOIT)
  preload: true,                  // good for primary font (helps LCP)
});