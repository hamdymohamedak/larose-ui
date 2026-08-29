import { describe, expect, it } from 'vitest';
import { resolveTenantConfig } from './resolveTenant';

describe('resolveTenantConfig', () => {
  it('uses tenant defaults when props are not provided', () => {
    const resolved = resolveTenantConfig({
      tenant: {
        id: 'acme',
        name: 'ACME',
        locale: 'ar',
        timezone: 'Africa/Cairo',
        theme: 'dark',
        permissions: ['employees.read'],
        features: { 'new-payroll': true },
        themePreset: 'ocean',
      },
    });

    expect(resolved.tenantId).toBe('acme');
    expect(resolved.locale).toBe('ar');
    expect(resolved.timezone).toBe('Africa/Cairo');
    expect(resolved.theme).toBe('dark');
    expect(resolved.permissions).toEqual(['employees.read']);
    expect(resolved.features).toEqual({ 'new-payroll': true });
    expect(resolved.brandColors?.primary).toBe('#0284c7');
  });

  it('explicit props override tenant configuration', () => {
    const resolved = resolveTenantConfig({
      tenant: {
        id: 'acme',
        permissions: ['employees.read'],
        features: { beta: true },
      },
      permissions: ['payroll.approve'],
      features: { beta: false },
      locale: 'de',
    });

    expect(resolved.permissions).toEqual(['payroll.approve']);
    expect(resolved.features).toEqual({ beta: false });
    expect(resolved.locale).toBe('de');
  });

  it('uses tenant permissions when explicit permissions array is empty', () => {
    const resolved = resolveTenantConfig({
      tenant: { id: 'acme', permissions: ['employees.read'] },
      permissions: [],
    });
    expect(resolved.permissions).toEqual(['employees.read']);
  });

  it('falls back to tenantId when tenant object is omitted', () => {
    const resolved = resolveTenantConfig({ tenantId: 'acme' });
    expect(resolved.tenant?.id).toBe('acme');
  });
});
