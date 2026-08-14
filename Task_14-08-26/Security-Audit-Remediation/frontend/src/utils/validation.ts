export const isValidEmail = (
  email: string
): boolean => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const isValidPassword = (
  password: string
): boolean => {
  return password.length >= 8;
};

export const isValidName = (
  name: string
): boolean => {
  return (
    name.trim().length >= 2
  );
};

export const validateLogin = (
  email: string,
  password: string
): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Invalid email address";
  }

  if (!password) {
    return "Password is required";
  }

  if (!isValidPassword(password)) {
    return "Password must contain at least 8 characters";
  }

  return null;
};

export const validateRegister = (
  name: string,
  email: string,
  password: string
): string | null => {
  if (!isValidName(name)) {
    return "Name must contain at least 2 characters";
  }

  if (!isValidEmail(email)) {
    return "Invalid email address";
  }

  if (!isValidPassword(password)) {
    return "Password must contain at least 8 characters";
  }

  return null;
};