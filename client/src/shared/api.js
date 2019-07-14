export const API =
  process.env.NODE_ENV === 'production'
    ? 'http://production-url.com'
    : 'http://localhost:3000';
