import { createGlobalState } from './global-store';

import { ToastType } from '@/lib/enum/toast';

interface ToastStore {
  type: ToastType;
  message: string;
}

const initialValues: ToastStore = {
  type: 'hint',
  message: '',
};

export const ToastStore = createGlobalState<ToastStore>('toast', {
  ...initialValues,
});
