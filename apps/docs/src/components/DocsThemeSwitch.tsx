import { Switch } from '@larose-ui/react';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

export interface DocsThemeSwitchProps {
  /** Text label beside the switch — `full` shows “Dark mode”. */
  labelVariant?: 'none' | 'short' | 'full';
  className?: string;
}

export function DocsThemeSwitch({ labelVariant = 'short', className }: DocsThemeSwitchProps) {
  const { theme, setTheme } = useDocsTheme();
  const isDark = theme === 'dark';

  const label =
    labelVariant === 'full' ? 'Dark mode' : labelVariant === 'short' ? 'Dark' : 'Dark mode';

  return (
    <div
      className={[
        'docs-theme-switch',
        labelVariant === 'none' ? 'docs-theme-switch--no-label' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Switch
        label={label}
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        switchSize="sm"
      />
    </div>
  );
}
