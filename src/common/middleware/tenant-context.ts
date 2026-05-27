import { AsyncLocalStorage } from 'async_hooks';

export const tenantStorage = new AsyncLocalStorage<string>();

export class TenantContext {
  static getTenantId(): string {
    const tenantId = tenantStorage.getStore();
    if (!tenantId) {
      throw new Error('Tenant context is missing for the current request.');
    }
    return tenantId;
  }
}
