import { FilledButton, OutlineButton } from './style';
import React from 'react';

enum Variant {
  Filled = 'Filled',
  Outline = 'Outline',
}

type ButtonProps = {
  variant?: 'Filled' | 'Outline' | Variant;
  color?: string;
  backgound?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = Variant.Filled,
  color,
  backgound,
  children,
  ...rest
}: ButtonProps) {
  switch (variant) {
    case Variant.Filled:
      return (
        <FilledButton bgColor={backgound} textColor={color} {...rest}>
          {children}
        </FilledButton>
      );
    case Variant.Outline:
      return (
        <OutlineButton bgColor={backgound} textColor={color} {...rest}>
          {children}
        </OutlineButton>
      );
    default:
      return (
        <FilledButton bgColor={backgound} textColor={color} {...rest}>
          {children}
        </FilledButton>
      );
  }
}
