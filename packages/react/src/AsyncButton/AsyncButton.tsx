import { useCallback, useReducer, useRef, type ReactNode } from 'react';
import type { Size, Variant } from '@larose-ui/core';
import { createAsyncStateMachine } from '@larose-ui/core';
import { Button, type ButtonProps } from '../Button/Button';

export interface AsyncButtonProps extends Omit<ButtonProps, 'onClick' | 'loading' | 'error'> {
  action: () => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function AsyncButton({
  action,
  onSuccess,
  onError,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: AsyncButtonProps) {
  const machineRef = useRef(createAsyncStateMachine());
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const machine = machineRef.current;
  const errorMessage =
    machine.error && typeof machine.error === 'object' && 'message' in machine.error
      ? String((machine.error as { message: string }).message)
      : machine.error
        ? String(machine.error)
        : null;

  const handleClick = useCallback(async () => {
    machine.send({ type: 'SUBMIT' });
    forceUpdate();
    try {
      await action();
      machine.send({ type: 'SUCCESS' });
      onSuccess?.();
    } catch (err) {
      machine.send({ type: 'ERROR', error: err });
      onError?.(err);
    } finally {
      forceUpdate();
    }
  }, [action, machine, onSuccess, onError]);

  return (
    <Button
      variant={variant}
      size={size}
      loading={machine.state === 'submitting'}
      error={machine.state === 'error' ? errorMessage : null}
      disabled={disabled}
      onClick={() => void handleClick()}
      {...props}
    >
      {children}
    </Button>
  );
}
