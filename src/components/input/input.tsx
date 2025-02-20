import { Icon } from '@chakra-ui/react';
import Typography from '../typography/typography';
import { InputBox, StyledInput } from './style';
import { IconType } from 'react-icons';

type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  title?: string;
  iconElement?: IconType;
  placeholder?: string;
  error?: boolean;
};

export default function TextInput({
  title,
  placeholder,
  iconElement,
  error,
  ...rest
}: TextInputProps) {
  const IconComponent = iconElement;

  return (
    <InputBox>
      <Typography variant="Button" color={'#8083A3'}>
        {title}
      </Typography>
      <StyledInput
        {...rest}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        color={error ? '#ff808b' : '#1a1c1d'}
      />
      {IconComponent && (
        <Icon position={'absolute'} right={0} bottom={'8px'} fontSize={'20px'}>
          <IconComponent fill={error ? '#ff808b' : ''} />
        </Icon>
      )}
    </InputBox>
  );
}
