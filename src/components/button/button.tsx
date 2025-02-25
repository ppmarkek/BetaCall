import { Flex } from '@chakra-ui/react';
import { FilledButton, IconBox, LeftIconButton, OutlineButton } from './style';
import React from 'react';
import { IconType } from 'react-icons';

enum Variant {
  Filled = 'Filled',
  Outline = 'Outline',
  IconButton = 'IconButton',
}

type ButtonProps = {
  variant?: 'Filled' | 'Outline' | 'IconButton' | Variant;
  color?: string;
  width?: string;
  background?: string;
  height?: string;
  iconElement?: IconType;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = Variant.Filled,
  color,
  width,
  height,
  background,
  children,
  iconElement,
  ...rest
}: ButtonProps) {
  const IconComponent = iconElement;

  switch (variant) {
    case Variant.Filled:
      return (
        <FilledButton
          buttonHeight={height}
          buttonWidth={width}
          bgColor={background}
          textColor={color}
          {...rest}
        >
          {children}
        </FilledButton>
      );
    case Variant.Outline:
      return (
        <OutlineButton
          buttonHeight={height}
          buttonWidth={width}
          bgColor={background}
          textColor={color}
          {...rest}
        >
          {children}
        </OutlineButton>
      );
    case Variant.IconButton:
      return (
        <Flex width={'100%'}>
          <IconBox>
            {IconComponent && <IconComponent fill={'#8083A3'} />}
          </IconBox>
          <LeftIconButton {...rest}>{children}</LeftIconButton>
        </Flex>
      );
    default:
      return (
        <FilledButton
          buttonHeight={height}
          buttonWidth={width}
          bgColor={background}
          textColor={color}
          {...rest}
        >
          {children}
        </FilledButton>
      );
  }
}
