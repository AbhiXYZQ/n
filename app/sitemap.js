export default function sitemap() {
  const baseUrl = 'https://www.nainix.me';

  const routes = [
    '',
    '/jobs',
    '/pricing',
    '/founders',
    '/faq',
    '/contact',
    '/login',
    '/register',
    '/legal',
    '/collab',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '/jobs' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}
