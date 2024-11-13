export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const numbers = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Format as (XX) XXXX-XXXX
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digits
  const numbers = phone.replace(/\D/g, '');
  
  // Add Brazil country code if not present
  if (!numbers.startsWith('55')) {
    return `55${numbers}`;
  }
  
  return numbers;
}

export function validateWhatsAppNumber(number: string): boolean {
  // Must be exactly 13 digits (55 + DDD + 9 digits)
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length !== 13) return false;
  
  // Must start with 55 (Brazil)
  if (!cleanNumber.startsWith('55')) return false;
  
  // Must have valid DDD (11-99)
  const ddd = parseInt(cleanNumber.substring(2, 4));
  if (ddd < 11 || ddd > 99) return false;
  
  // Must start with 9 (mobile number)
  if (cleanNumber[4] !== '9') return false;
  
  return true;
}