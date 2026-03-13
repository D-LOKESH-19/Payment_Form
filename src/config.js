// src/config/index.js
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

// Optional: Add validation
if (!WEB3FORMS_KEY) {
  console.warn('⚠️ Web3Forms key is missing. Please add VITE_WEB3FORMS_KEY to your .env file');
}

// You can also add other environment variables here
export const APP_ENV = import.meta.env.MODE;
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;