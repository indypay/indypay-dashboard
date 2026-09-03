import Zod from 'zod';
import { useForm, Path, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { AnyType } from './types';

type FormValues = Record<string, AnyType>;

interface FormProps<T extends FormValues> {
  schema?: Zod.ZodType<T>;
  initialValues: T;
}

export const useHandleForm = <T extends FormValues>({
  schema,
  initialValues,
}: FormProps<T>) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    clearErrors,
    trigger,
    unregister,
    formState: { errors, isSubmitting, submitCount, isDirty },
  } = useForm({
    resolver: schema && zodResolver(schema),
    defaultValues: initialValues as DefaultValues<T>,
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const setValues = useCallback(
    (data: DefaultValues<T>) => {
      reset(data);
    },
    [reset],
  );

  const validate = (fieldName: Path<T>) => {
    if (fieldName) {
      trigger(fieldName);
      clearErrors(fieldName);
    } else {
      trigger();
    }
  };

  const setValidateData = (name: Path<T>, value: AnyType) => {
    setValue(name, value, { shouldValidate: true });
  };

  return {
    control,
    handleSubmit,
    values: watch(),
    setValue,
    reset,
    errors,
    register,
    setValues,
    clearErrors,
    trigger,
    validate,
    getValues,
    setValidateData,
    isSubmitting,
    submitCount,
    isDirty,
    unregister,
  };
};

export const invoiceSchema = Zod.object({
  invoiceNumber: Zod.string()
    .min(1, 'Invoice number is required.')
    .max(10, 'Invoice number cannot exceed 10 characters.'),
  description: Zod.string()
    .max(500, 'Description cannot exceed 500 characters.')
    .optional(),
  customer: Zod.string().min(1, 'Customer is required.'),
  issueDate: Zod.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Issue date must be a valid date.',
  ),
  expiryDate: Zod.string()
    .optional()
    .refine(
      (date) => !date || !isNaN(Date.parse(date)),
      'Expiry date must be a valid date.',
    ),
  totalAmount: Zod.number().positive('Total amount must be a positive number.'),
  customerNotes: Zod.string()
    .max(1000, 'Customer notes cannot exceed 1000 characters.')
    .optional()
    .or(Zod.literal('')),
  termsAndServices: Zod.string().optional().or(Zod.literal('')),
  billingAddress: Zod.string()
    .max(255, 'Billing address cannot exceed 255 characters.')
    .optional()
    .or(Zod.literal('')),
  shippingAddress: Zod.string().optional().or(Zod.literal('')),
  gstEnabled: Zod.boolean(),
  partialPayments: Zod.boolean(),
  includeBankDetails: Zod.boolean(),
  items: Zod.array(
    Zod.object({
      itemId: Zod.string(),
      quantity: Zod.number().min(1, 'Quantity must be at least 1.'),
    }),
  ).min(1, 'At least one item must be selected.'),
});

export type InvoiceFormData = Zod.infer<typeof invoiceSchema>;
