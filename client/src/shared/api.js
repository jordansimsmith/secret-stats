const PROD_HOST = 'localhost';

export const API =
  process.env.NODE_ENV === 'production'
    ? `http://${PROD_HOST}/api`
    : 'http://localhost:3000';
