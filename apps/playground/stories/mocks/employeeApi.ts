export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
}

let employees: Employee[] = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', department: 'Engineering' },
  { id: '2', name: 'Sara Ali', role: 'Designer', department: 'Design' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', department: 'Operations' },
];

export function resetEmployees(): void {
  employees = [
    { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', department: 'Engineering' },
    { id: '2', name: 'Sara Ali', role: 'Designer', department: 'Design' },
    { id: '3', name: 'Omar Hassan', role: 'Manager', department: 'Operations' },
  ];
}

export function installEmployeeMock(): () => void {
  const original = globalThis.fetch;

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    const method = init?.method ?? 'GET';

    if (url.includes('/api/employees') && method === 'GET') {
      return new Response(JSON.stringify(employees), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('/api/employees') && method === 'POST') {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      const employee: Employee = {
        id: String(Date.now()),
        name: body.name ?? 'Unknown',
        role: body.role ?? 'Staff',
        department: body.department ?? 'General',
      };
      employees = [...employees, employee];
      return new Response(JSON.stringify(employee), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.match(/\/api\/employees\/\d+/) && method === 'DELETE') {
      const id = url.split('/').pop();
      employees = employees.filter((e) => e.id !== id);
      return new Response(null, { status: 204 });
    }

    if (url.includes('/api/error')) {
      return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }

    if (url.includes('/api/forbidden')) {
      return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    return original(input, init);
  };

  return () => {
    globalThis.fetch = original;
  };
}
