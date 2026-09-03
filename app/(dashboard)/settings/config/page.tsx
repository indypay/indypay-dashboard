'use client';

import { Button, Card, Select, SelectItem } from '@heroui/react';
import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@heroui/react';
import { useToast } from '@/lib/components/Toast/ToastContext';
import { useEditCount, useGetCount } from '@/lib/hooks/use-count';
import { useEffect } from 'react';
import { getMerchantList } from '@/lib/hooks/merchant-list';
import { safeAny } from '@/lib/interfaces/global.interface';
import { editCountRequest } from '@/lib/interfaces/users.interface';
import { useHandleForm } from '@/lib/formHandler';

const formSchema = z.object({
  userId: z.string().min(1, 'Merchant ID is required'),
  count: z.number().min(0, 'Count is required'),
});

const initialValues = {
  userId: '',
  count: 0,
};

export default function OnboardingPage() {
  const { showToast } = useToast();
  const { data: merchantList } = getMerchantList();

  const { values, handleSubmit, control, errors, setValue, isDirty } =
    useHandleForm({
      schema: formSchema,
      initialValues,
    });

  const {
    data: countData,
    refetch,
    isPending: isGetCountPending,
  } = useGetCount(values.userId);
  const { mutate: editCount, isPending: isEditPending } = useEditCount();

  useEffect(() => {
    if (countData?.[0]?.data) {
      setValue('count', countData?.[0]?.data?.count || 0);
    }
  }, [countData?.[0]?.data, setValue]);

  useEffect(() => {
    if (values.userId) {
      refetch();
    }
  }, [values.userId, refetch]);

  const onSubmit = (data: editCountRequest) => {
    const mutation = editCount;
    mutation(data, {
      onSuccess: (data: [safeAny, safeAny]) => {
        const [response, error] = data;
        if (error) {
          showToast(error?.message, 'error');
          return;
        }
        if (response) {
          showToast('Count updated successfully', 'success');
        }
      },
      onError: (error: safeAny) => {
        showToast(error?.message || 'An error occurred', 'error');
      },
    });
  };

  return (
    <div className="w-1/2 space-y-6 px-8 py-8 mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Count Configuration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Merchant ID"
                  className="w-full"
                  name="userId"
                  errorMessage={errors.userId?.message}
                  value={values.userId}
                  onChange={(e) => {
                    setValue('userId', e.target.value);
                  }}
                >
                  {(merchantList?.[0]?.data || []).map((merchant: any) => (
                    <SelectItem key={merchant.id}>
                      {merchant.fullName}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="count"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  label="Count"
                  type="number"
                  errorMessage={errors.count?.message}
                  placeholder="Enter count"
                  value={value.toString()}
                  onChange={(e) => onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              color="primary"
              type="submit"
              style={{
                background:
                  !isDirty || isEditPending || isGetCountPending
                    ? 'var(--border)'
                    : 'linear-gradient(to right, var(--border), var(--primary))',
                border: 'none',
                color:
                  !isDirty || isEditPending || isGetCountPending
                    ? 'var(--text-muted)'
                    : 'var(--background)',
                fontWeight: 600,
                cursor:
                  !isDirty || isEditPending || isGetCountPending
                    ? 'not-allowed'
                    : 'pointer',
              }}
              disabled={!isDirty || isEditPending || isGetCountPending}
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
