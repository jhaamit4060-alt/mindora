export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || email.trim() === "") {
    return { valid: false, error: "Email is required" }
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" }
  }

  return { valid: true }
}

export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === "") {
    return { valid: false, error: "Password is required" }
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" }
  }

  return { valid: true }
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Name is required" }
  }

  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" }
  }

  return { valid: true }
}
