import { Button, type ButtonProps } from '../Button/Button';

export interface FormContinueProps extends ButtonProps {
  /** When false, Continue stays disabled until required data is entered. */
  complete: boolean;
}

/**
 * Continue/Next control that stays disabled until required fields are filled.
 * @see https://developer.apple.com/design/human-interface-guidelines/entering-data
 */
export function FormContinue({
  complete,
  disabled,
  children = 'Continue',
  ...props
}: FormContinueProps) {
  return (
    <Button type="submit" disabled={disabled || !complete} {...props}>
      {children}
    </Button>
  );
}
