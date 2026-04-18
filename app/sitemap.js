export default function sitemap() {
  const baseUrl = 'https://nainix.me';

  const routes = [
    '',
    '/jobs',
    '/pricing',
    '/founders',
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
