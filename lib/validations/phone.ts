import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export function validatePhoneNumber(phone: string, defaultCountry: CountryCode = 'NG') {
  try {
    if (!isValidPhoneNumber(phone, defaultCountry)) {
      return { valid: false, error: 'Invalid phone number' };
    }

    const phoneNumber = parsePhoneNumber(phone, defaultCountry);
    
    return {
      valid: true,
      formatted: phoneNumber.formatInternational(),
      national: phoneNumber.formatNational(),
      international: phoneNumber.number,
      country: phoneNumber.country,
    };
  } catch (error) {
    return { valid: false, error: 'Invalid phone number format' };
  }
}

export function formatPhoneForSMS(phone: string, defaultCountry: CountryCode = 'NG'): string {
  try {
    const phoneNumber = parsePhoneNumber(phone, defaultCountry);
    return phoneNumber.number; // Returns E.164 format: +2348012345678
  } catch (error) {
    return phone;
  }
}
