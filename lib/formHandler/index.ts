import { Control as FormControl, Controller } from 'react-hook-form';

import { useHandleForm, invoiceSchema } from './useHandleForm';
import { AnyType } from './types';

type Control = FormControl<AnyType>;

export { Controller, useHandleForm, type Control, invoiceSchema };
