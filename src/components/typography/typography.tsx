import { Text } from '@chakra-ui/react';

enum Variant {
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
  H4 = 'H4',
  H5 = 'H5',
  Button = 'Button',
  Regular = 'Regular',
  SmallRegular = 'SmallRegular',
}

enum TypographyWeight {
  'Bold',
  'Regular',
  'Small',
}

type TypographyProps = {
  variant?:
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H5'
    | 'Button'
    | 'Regular'
    | 'SmallRegular'
    | Variant;
  color?: string;
  weight?: TypographyWeight;
  children?: React.ReactNode;
};

export default function Typography({
  variant,
  color,
  weight,
  children,
}: TypographyProps) {
  switch (variant) {
    case Variant.H1:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontWeight={'700'}
          fontSize={'32px'}
          lineHeight={'42px'}
        >
          {children}
        </Text>
      );
    case Variant.H2:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontWeight={'700'}
          fontSize={'26px'}
          lineHeight={'38px'}
        >
          {children}
        </Text>
      );
    case Variant.H3:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontWeight={'700'}
          fontSize={'20px'}
          lineHeight={'32px'}
        >
          {children}
        </Text>
      );
    case Variant.H4:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontWeight={'700'}
          fontSize={'18px'}
          lineHeight={'27px'}
        >
          {children}
        </Text>
      );
    case Variant.H5:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontSize={'16px'}
          fontWeight={'700'}
          lineHeight={'24px'}
        >
          {children}
        </Text>
      );
    case Variant.Button:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontSize={'16px'}
          fontWeight={
            weight === TypographyWeight.Bold
              ? '700'
              : weight === TypographyWeight.Regular
                ? '400'
                : weight === TypographyWeight.Small
                  ? '300'
                  : '400'
          }
          lineHeight={'19px'}
        >
          {children}
        </Text>
      );
    case Variant.Regular:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontSize={'14px'}
          fontWeight={
            weight === TypographyWeight.Bold
              ? '700'
              : weight === TypographyWeight.Regular
                ? '400'
                : weight === TypographyWeight.Small
                  ? '300'
                  : '400'
          }
          lineHeight={'21px'}
        >
          {children}
        </Text>
      );
    case Variant.SmallRegular:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontSize={'12px'}
          fontWeight={
            weight === TypographyWeight.Bold
              ? '700'
              : weight === TypographyWeight.Regular
                ? '400'
                : weight === TypographyWeight.Small
                  ? '300'
                  : '400'
          }
          lineHeight={'18px'}
        >
          {children}
        </Text>
      );
    default:
      return (
        <Text
          color={color}
          fontFamily={'Lato'}
          fontSize={'14px'}
          fontWeight={
            weight === TypographyWeight.Bold
              ? '700'
              : weight === TypographyWeight.Regular
                ? '400'
                : weight === TypographyWeight.Small
                  ? '300'
                  : '400'
          }
          lineHeight={'21px'}
        >
          {children}
        </Text>
      );
  }
}
