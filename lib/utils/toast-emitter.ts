import { ToastType } from '../enum/toast';

type ToastFn = (message: string, type: ToastType) => void;

let _emit: ToastFn | null = null;

export const registerToastEmitter = (fn: ToastFn) => {
  _emit = fn;
};

export const emitToast = (message: string, type: ToastType) => {
  _emit?.(message, type);
};
