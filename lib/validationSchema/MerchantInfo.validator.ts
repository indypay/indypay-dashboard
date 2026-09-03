import { object, string } from 'zod';

import { PHONE_REGEX, NAME_REGEX } from '../utils/validators-regex';

export const MerchantBasicSchema = object({
  name: string()
    .min(1, { message: 'Please enter a valid name' })
    .max(30, { message: 'Please enter a valid name' })
    .regex(NAME_REGEX, { message: `Please enter a valid name` }),
  phone: string()
    .min(10, { message: 'Please enter a valid mobile number' })
    .max(12, { message: 'Please enter a valid mobile number' })
    .regex(new RegExp(PHONE_REGEX), {
      message: 'Please enter a valid mobile number',
    }),
  businessName: string()
    .min(5, { message: 'Please enter a business name' })
    .max(50, { message: 'Please enter a business name' })
    .regex(NAME_REGEX, { message: 'Please enter a valid business name' }),
  designation: string()
    .min(5, { message: 'Please enter a designation' })
    .max(50, { message: 'Please enter a designation' })
    .regex(NAME_REGEX, { message: 'Please enter a valid designation' }),
});
