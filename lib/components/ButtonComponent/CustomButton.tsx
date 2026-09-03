import React from 'react';
import { Button } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';

interface CustomButtonProps extends Omit<AntdButtonProps, 'size'> {
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  isDisabled,
  isLoading,
  onPress,
  size = 'xl',
  className = '',
  children,
  startContent,
  endContent,
  ...restProps
}) => {
  const sizeMap = {
    xs: 'small',
    sm: 'small',
    md: 'middle',
    lg: 'large',
    xl: 'large',
  } as const;

  const antdSize = sizeMap[size] || 'large';

  // If htmlType is "submit", don't override onClick to allow native form submission
  const handleClick =
    restProps.htmlType === 'submit' ? undefined : onPress || restProps.onClick;

  return (
    <Button
      {...restProps}
      size={antdSize}
      disabled={isDisabled}
      loading={isLoading}
      onClick={handleClick}
      className={className}
      icon={startContent}
    >
      {children}
      {endContent}
    </Button>
  );
};
