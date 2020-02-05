/**
 * This test if current environment is production based on `process.env.NODE_ENV`
 */

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
