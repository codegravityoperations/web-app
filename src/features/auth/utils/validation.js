export const validateReg = (fields, isCandidate) => {
  const e = {};
  if (!fields.firstName.trim()) e.firstName = "First name is required";
  if (!fields.lastName.trim())  e.lastName  = "Last name is required";
  if (!fields.email.trim())     e.email     = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
  if (!fields.phone.trim())     e.phone     = "Phone number is required";
  else if (!/^\+?[0-9]{7,15}$/.test(fields.phone.replace(/[\s\-()]/g,""))) e.phone = "Enter a valid phone (7–15 digits)";
  if (!fields.password)         e.password  = "Password is required";
  else if (fields.password.length < 8) e.password = "Minimum 8 characters";
  if (!fields.confirmPassword)         e.confirmPassword = "Please confirm your password";
  else if (fields.password !== fields.confirmPassword) e.confirmPassword = "Passwords do not match";
  if (isCandidate && !fields.appliedRole.trim()) e.appliedRole = "Applied role is required";
  return e;
};

export const validateLogin = (fields) => {
  const e = {};
  if (!fields.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
  if (!fields.password) e.password = "Password is required";
  return e;
};