export const business = { name: 'Your Company Name', phoneLabel: 'Your Number', phone: '' };
export function getCallHref(phone: string): string | undefined {
  const cleaned = phone.replace(/[\s().-]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned) ? `tel:${cleaned}` : undefined;
}