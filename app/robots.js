export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/verify/',
          '/reset-password/',
          '/forgot-password/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://www.nainix.me/sitemap.xml',
  };
}
