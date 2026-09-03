import type { AlertDialogAction, AlertDialogButtonLayout } from './types';

export const MAX_ALERT_BUTTONS = 3;
export const MAX_ALERT_TITLE_CHARS = 120;

export function warnIfAlertTitleTooLong(title: string): void {
  if (title.length > 120) {
    console.warn(
      `Alert title is ${title.length} characters. Keep alert titles short — ideally under two lines.`,
    );
  }
  if (/^(error|warning)\.?$/i.test(title.trim())) {
    console.warn('Avoid alert titles like "Error" that don\'t convey useful information.');
  }
}

export function warnIfTooManyAlertButtons(count: number): void {
  if (count > 3) {
    console.warn(`Alert has ${count} buttons. Modal alerts support at most three buttons.`);
  }
}

export function warnIfOkAsDefault(action: AlertDialogAction): void {
  if (action.role === 'default' && /^ok$/i.test(action.label.trim())) {
    console.warn(
      'Avoid using "OK" as the default alert button unless the alert is purely informational.',
    );
  }
}

export function validateAlertActions(actions: AlertDialogAction[]): void {
  warnIfTooManyAlertButtons(actions.length);

  const cancelCount = actions.filter((action) => action.role === 'cancel').length;
  if (cancelCount > 1) {
    console.warn('Alerts should include at most one Cancel button.');
  }

  const destructive = actions.filter((action) => action.role === 'destructive');
  if (destructive.length > 0 && cancelCount === 0) {
    console.warn('Include a Cancel button when an alert offers a destructive action.');
  }

  for (const action of actions) {
    if (action.role === 'cancel' && action.label !== 'Cancel') {
      console.warn('Use the title "Cancel" for alert cancel buttons.');
    }
    if (action.role === 'default') warnIfOkAsDefault(action);
  }
}

export function orderAlertActions(
  actions: AlertDialogAction[],
  presentation: 'compact' | 'tablet' | 'desktop' | 'spatial' | 'tv' | 'wearable',
): AlertDialogButtonLayout {
  const cancel = actions.filter((action) => action.role === 'cancel');
  const destructive = actions.filter((action) => action.role === 'destructive');
  const defaults = actions.filter((action) => action.role === 'default' || !action.role);
  const other = actions.filter(
    (action) =>
      action.role !== 'cancel' &&
      action.role !== 'destructive' &&
      action.role !== 'default' &&
      Boolean(action.role),
  );

  const stackedPresentation =
    presentation === 'compact' ||
    presentation === 'tablet' ||
    presentation === 'wearable' ||
    presentation === 'tv';
  const stack = stackedPresentation && actions.length >= 3;

  if (stack) {
    return {
      layout: 'stack',
      ordered: [...defaults, ...other, ...destructive, ...cancel],
    };
  }

  return {
    layout: 'row',
    ordered: [...cancel, ...other, ...destructive, ...defaults],
  };
}

export function resolveCancelAction(actions: AlertDialogAction[]): AlertDialogAction | undefined {
  return actions.find((action) => action.role === 'cancel');
}

export function shouldStyleDestructive(action: AlertDialogAction): boolean {
  return action.role === 'destructive' && !action.deliberate;
}

export function formatAlertTitle(title: string): string {
  return title.trim();
}
