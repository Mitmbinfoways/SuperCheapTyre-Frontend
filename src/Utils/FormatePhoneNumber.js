import { formatPhoneNumberIntl } from 'react-phone-number-input';

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  try {
    // formatPhoneNumberIntl handles the formatting based on the country code in the string
    return formatPhoneNumberIntl(phoneNumber) || phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};