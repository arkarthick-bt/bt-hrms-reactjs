export const validateName = (name: string) => {
  if (!name) return true;
  return /^[A-Za-z\s]+$/.test(name);
};

export const validatePhone = (phone: string) => {
  if (!phone) return true;
  return /^\d{10}$/.test(phone);
};

export const validateEmail = (email: string) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sanitizeNumeric = (value: string) => {
  return value.replace(/\D/g, '');
};

export const sanitizeName = (value: string) => {
  return value.replace(/[^A-Za-z\s]/g, '');
};
