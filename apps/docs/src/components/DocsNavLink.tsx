import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItem } from '@larose-ui/react';

export interface DocsNavLinkProps {
  to: string;
  children: ReactNode;
  end?: boolean;
}

export function DocsNavLink({ to, children, end = false }: DocsNavLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const active = end
    ? location.pathname === to
    : location.pathname === to ||
      (to !== '/' && location.pathname.startsWith(`${to}/`));

  return (
    <SidebarItem active={active} onClick={() => navigate(to)}>
      {children}
    </SidebarItem>
  );
}
