import { Icon } from '@chakra-ui/react';
import Typography from '../typography/typography';
import { InputBox, StyledInput } from './style';
import { IconType } from 'react-icons';
import { Tooltip } from '../ui/tooltip';

type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  title?: string;
  iconElement?: IconType;
  placeholder?: string;
  error?: boolean;
  errorText?: string;
};

export default function TextInput({
  title,
  placeholder,
  iconElement,
  error,
  errorText,
  ...rest
}: TextInputProps) {
  const IconComponent = iconElement;

  return (
    <InputBox>
      <Typography variant="Button" color={'#8083A3'}>
        {title}
      </Typography>
      <Tooltip
        showArrow
        content={errorText}
        contentProps={{
          css: {
            '--tooltip-bg': '#ff808b',
            padding: '10px',
            display: error ? 'block' : 'none',
          },
        }}
        openDelay={500}
        closeDelay={100}
      >
        <StyledInput
          {...rest}
          $icon={!!IconComponent}
          placeholder={placeholder}
          className={error ? 'input-error' : ''}
          color={error ? '#ff808b' : '#1a1c1d'}
        />
      </Tooltip>
      {IconComponent && (
        <Icon
          className={`input-icon ${error ? 'input-icon-error' : ''}`}
          position={'absolute'}
          right={0}
          bottom={'8px'}
          fontSize={'20px'}
        >
          <IconComponent />
        </Icon>
      )}
    </InputBox>
  );
}
