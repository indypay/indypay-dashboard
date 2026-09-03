import { safeAny } from '@/lib/interfaces/global.interface';
import { Input } from 'antd';
import { forwardRef, useEffect } from 'react';
import type { InputProps, InputRef } from 'antd';

const autofillStyles = `
  input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
      -webkit-text-fill-color: #374151 !important;
  }

  input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
      -webkit-text-fill-color: #374151 !important;
  }

  .ant-input:hover,
  .ant-input-affix-wrapper:hover {
    background-color: #ffffff !important;
    border-color: #1F834C !important;
  }

  .ant-input:focus,
  .ant-input-affix-wrapper:focus,
  .ant-input-focused,
  .ant-input-affix-wrapper-focused {
    background-color: #ffffff !important;
    border-color: #1F834C !important;
    box-shadow: none !important;
  }

  .ant-input-status-error:not(.ant-input-disabled):hover {
    border-color: #D51C44 !important;
  }
`;

interface CustomInputProps extends Omit<InputProps, 'size' | 'variant'> {
  isInvalid?: boolean;
  errorMessage?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  labelPlacement?: 'outside' | 'inside';
  isRequired?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'borderless' | 'underlined' | 'bordered';
  color?: safeAny;
  onValueChange?: (value: string) => void;
  clearButton?: boolean;
  onClear?: () => void;
}

const CustomInput = forwardRef<InputRef, CustomInputProps>((props, ref) => {
  const {
    isInvalid,
    errorMessage,
    label,
    className,
    size,
    labelPlacement,
    isRequired,
    startContent,
    endContent,
    variant,
    color,
    onValueChange,
    clearButton,
    onClear,
    ...restProps
  } = props;

  useEffect(() => {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(autofillStyles));
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sizeMap = {
    xs: 'small',
    sm: 'small',
    md: 'middle',
    lg: 'large',
    xl: 'large',
  } as const;

  const variantMap: Record<
    string,
    'outlined' | 'filled' | 'borderless' | undefined
  > = {
    bordered: 'outlined',
    outlined: 'outlined',
    filled: 'filled',
    borderless: 'borderless',
    underlined: 'borderless',
  };

  const antdSize = size ? sizeMap[size] || 'middle' : 'middle';
  const antdVariant = variant ? variantMap[variant] : undefined;

  const inputClassName = `
    ${className || ''}
    bg-white
    border border-gray-300
    rounded-xl
    text-gray-700
    h-12
    ${isInvalid ? 'border-[#D51C44]' : ''}
  `.trim();

  return (
    <div className="w-full">
      {label && labelPlacement === 'outside' && (
        <label className="block text-base mb-1 text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        {...restProps}
        ref={ref}
        size={antdSize}
        variant={antdVariant}
        status={isInvalid ? 'error' : undefined}
        className={inputClassName}
        prefix={startContent}
        suffix={endContent}
        placeholder={label && !labelPlacement ? label : restProps.placeholder}
        allowClear={clearButton || restProps.allowClear}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e.target.value);
          }
          if (restProps.onChange) {
            restProps.onChange(e);
          }
          if (onClear && !e.target.value) {
            onClear();
          }
        }}
      />
      {isInvalid && errorMessage && (
        <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
      )}
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
