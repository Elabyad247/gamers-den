export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email ? emailRegex.test(email) : false;
};

export const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  return /\d/.test(password);
};

export const isValidMobile = (mobile) => {
  if (!mobile) return false;
  const digitsOnly = mobile.replace(/\D/g, "");
  const mobileRegex = /^\d{10,12}$/;
  return mobileRegex.test(digitsOnly);
};

export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    // Check protocol
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return false;
    }

    // Check for common image extensions
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    const hasImageExtension = imageExtensions.some((ext) =>
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    );

    // Allow URLs without explicit extensions (they might be dynamic)
    return true;
  } catch (e) {
    return false;
  }
};

export const meetsMinLength = (text, minLength) => {
  return text.trim().length >= minLength;
};

export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const sanitizeText = (text) => {
  if (!text) return "";
  return text.trim();
};

export const sanitizePrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) return 0;
  if (numPrice > 1000000) return 1000000;
  return Math.round(numPrice * 100) / 100;
};
