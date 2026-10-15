export function generateSlug(fullName: string): string {
  const clean = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${clean || "profile"}-${randomPart}`;
}

export function validateIndianPhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, "");
  // Accept 10 digits, or 91 followed by 10 digits starting with 6,7,8,9
  if (clean.length === 10 && /^[6-9]\d{9}$/.test(clean)) return true;
  if (clean.length === 12 && clean.startsWith("91") && /^[6-9]\d{9}$/.test(clean.slice(2))) return true;
  return false;
}

export function formatIndianPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  if (clean.length === 12 && clean.startsWith("91")) {
    const p = clean.slice(2);
    return `+91 ${p.slice(0, 5)} ${p.slice(5)}`;
  }
  return phone;
}
