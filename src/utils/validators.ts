export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidGymCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code.trim().toUpperCase());
}
