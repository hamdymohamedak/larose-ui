import { forwardRef } from 'react';
import { Input, type InputProps } from '../Input/Input';

export type SecureFieldProps = Omit<InputProps, 'type' | 'defaultValue'>;

/**
 * Password entry that follows Apple HIG: never prepopulate sensitive fields.
 * @see https://developer.apple.com/design/human-interface-guidelines/entering-data
 */
export const SecureField = forwardRef<HTMLInputElement, SecureFieldProps>(
  ({ autoComplete = 'current-password', ...props }, ref) => {
    if (process.env.NODE_ENV !== 'production' && props.value !== undefined && props.value !== '') {
      console.warn(
        '[SecureField] Avoid prepopulating password fields. Use biometric or keychain auth instead.',
      );
    }

    return (
      <Input
        ref={ref}
        type="password"
        autoComplete={autoComplete}
        spellCheck={false}
        {...props}
      />
    );
  },
);

SecureField.displayName = 'SecureField';
