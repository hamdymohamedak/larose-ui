import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button/Button';
import { Drawer } from './Drawer/Drawer';
import { Popover } from './Popover/Popover';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion/Accordion';
import { Pagination } from './Pagination/Pagination';
import { DataTable } from './DataTable/DataTable';
import { FileUpload } from './FileUpload/FileUpload';
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
} from './Sidebar/Sidebar';
import { Header, HeaderTitle, HeaderActions } from './Header/Header';
import { CommandPalette } from './CommandPalette/CommandPalette';
import { DatePicker } from './DatePicker/DatePicker';
import { TimePicker } from './TimePicker/TimePicker';
import { DateRangePicker } from './DateRangePicker/DateRangePicker';
import { Input } from './Input/Input';
import { Textarea } from './Textarea/Textarea';
import { Select } from './Select/Select';
import { Checkbox } from './Checkbox/Checkbox';
import { Switch } from './Switch/Switch';
import { Progress } from './Progress/Progress';
import { Alert } from './Alert/Alert';
import { Tooltip } from './Tooltip/Tooltip';
import { ToastProvider, useToast } from './Toast/Toast';
import { Tabs, TabsList, TabsTrigger, TabsPanel } from './Tabs/Tabs';
import { LaRoseProvider } from './provider/LaRoseProvider';

function renderWithProvider(ui: React.ReactElement) {
  return render(<LaRoseProvider>{ui}</LaRoseProvider>);
}

describe('Button', () => {
  it('renders children', () => {
    renderWithProvider(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProvider(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('handles click when not disabled', async () => {
    const onClick = vi.fn();
    renderWithProvider(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Input', () => {
  it('associates label with input', () => {
    renderWithProvider(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    renderWithProvider(<Input label="Name" error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Alert', () => {
  it('renders with role alert', () => {
    renderWithProvider(<Alert variant="success">Saved successfully</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved successfully');
  });
});

describe('Textarea', () => {
  it('associates label with textarea', () => {
    renderWithProvider(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders options', () => {
    renderWithProvider(
      <Select
        label="Department"
        options={[
          { label: 'Engineering', value: 'eng' },
          { label: 'Design', value: 'design' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('renders labeled checkbox', () => {
    renderWithProvider(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });
});

describe('Switch', () => {
  it('toggles via click', async () => {
    const onCheckedChange = vi.fn();
    renderWithProvider(
      <Switch label="Notifications" onCheckedChange={onCheckedChange} />,
    );
    await userEvent.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('Progress', () => {
  it('exposes progressbar semantics', () => {
    renderWithProvider(<Progress value={40} label="Upload" showValue />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('shows tooltip on hover', async () => {
    renderWithProvider(
      <Tooltip content="More info">
        <Button>Help</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.hover(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('More info');
  });
});

describe('Tabs', () => {
  it('switches panels', async () => {
    renderWithProvider(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsPanel value="one">Panel one</TabsPanel>
        <TabsPanel value="two">Panel two</TabsPanel>
      </Tabs>,
    );
    expect(screen.getByText('Panel one')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Panel two')).toBeInTheDocument();
  });
});

function ToastProbe({ message }: { message: string }) {
  const { toast } = useToast();
  useEffect(() => {
    toast({ message, variant: 'success' });
  }, [message, toast]);
  return null;
}

describe('Toast', () => {
  it('renders toast from provider', () => {
    render(
      <LaRoseProvider>
        <ToastProvider>
          <ToastProbe message="Saved" />
        </ToastProvider>
      </LaRoseProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });
});

describe('Drawer', () => {
  it('renders when open', () => {
    renderWithProvider(
      <Drawer open title="Filters" onClose={() => undefined}>
        Filter content
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });
});

describe('Popover', () => {
  it('opens on trigger click', async () => {
    renderWithProvider(
      <Popover trigger={<Button>Menu</Button>} content="Popover body" />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Popover body');
  });
});

describe('Breadcrumb', () => {
  it('marks current page', () => {
    renderWithProvider(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Employees', href: '/employees' },
          { label: 'Ahmed', current: true },
        ]}
      />,
    );
    expect(screen.getByText('Ahmed')).toHaveAttribute('aria-current', 'page');
  });
});

describe('Accordion', () => {
  it('expands panel on trigger click', async () => {
    renderWithProvider(
      <Accordion defaultValue={['details']} collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Hidden content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Hidden content')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByText('Hidden content')).not.toBeVisible();
  });
});

describe('Pagination', () => {
  it('changes page on click', async () => {
    const onPageChange = vi.fn();
    renderWithProvider(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('DataTable', () => {
  it('renders rows', () => {
    renderWithProvider(
      <DataTable
        caption="Employees"
        data={[
          { id: '1', name: 'Ahmed', role: 'Engineer' },
          { id: '2', name: 'Sara', role: 'Designer' },
        ]}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', accessor: (row) => row.name },
          { key: 'role', header: 'Role', accessor: (row) => row.role },
        ]}
      />,
    );
    expect(screen.getByRole('table', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByText('Ahmed')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    renderWithProvider(
      <DataTable
        data={[]}
        keyExtractor={() => 'x'}
        columns={[{ key: 'name', header: 'Name', accessor: () => '' }]}
        emptyTitle="No employees"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No employees');
  });
});

describe('FileUpload', () => {
  it('renders labeled upload control', () => {
    renderWithProvider(<FileUpload label="Attachments" buttonLabel="Upload files" />);
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('marks active navigation item', () => {
    renderWithProvider(
      <Sidebar>
        <SidebarHeader>laRose</SidebarHeader>
        <SidebarNav>
          <SidebarItem active>Dashboard</SidebarItem>
          <SidebarItem>Employees</SidebarItem>
        </SidebarNav>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('Header', () => {
  it('renders app header', () => {
    renderWithProvider(
      <Header>
        <HeaderTitle>Employees</HeaderTitle>
        <HeaderActions>
          <Button size="sm">Add</Button>
        </HeaderActions>
      </Header>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });
});

describe('CommandPalette', () => {
  it('filters commands', async () => {
    const onSelect = vi.fn();
    renderWithProvider(
      <CommandPalette
        open
        onOpenChange={() => undefined}
        items={[
          { id: 'add', label: 'Add employee', onSelect },
          { id: 'export', label: 'Export CSV', onSelect },
        ]}
      />,
    );
    await userEvent.type(screen.getByRole('searchbox'), 'export');
    expect(screen.getByRole('option', { name: 'Export CSV' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Add employee' })).not.toBeInTheDocument();
  });
});

describe('DatePicker', () => {
  it('associates label with date input', () => {
    renderWithProvider(<DatePicker label="Start date" value="2026-08-29" onChange={() => undefined} />);
    expect(screen.getByLabelText('Start date')).toHaveAttribute('type', 'date');
  });
});

describe('TimePicker', () => {
  it('associates label with time input', () => {
    renderWithProvider(<TimePicker label="Meeting time" value="09:30" onChange={() => undefined} />);
    expect(screen.getByLabelText('Meeting time')).toHaveAttribute('type', 'time');
  });
});

describe('DateRangePicker', () => {
  it('renders start and end date inputs', async () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DateRangePicker
        label="Reporting period"
        value={{ startDate: '2026-08-01', endDate: '2026-08-29' }}
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText('Start date')).toHaveValue('2026-08-01');
    await userEvent.clear(screen.getByLabelText('End date'));
    await userEvent.type(screen.getByLabelText('End date'), '2026-08-15');
    expect(onChange).toHaveBeenCalled();
  });
});
