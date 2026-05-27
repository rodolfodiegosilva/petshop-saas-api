import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppDataSource } from '../../../data-source';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';

function cleanDomain(value: string) {
  return value.replace(/(^\w+:|^)\/\//, '').split(':')[0];
}

export async function dynamicCorsOptions(
  req: { header(name: string): string | undefined },
  callback: (err: Error | null, options?: CorsOptions) => void,
) {
  const origin = req.header('Origin');
  if (!origin) {
    return callback(null, { origin: false });
  }

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const domain = cleanDomain(origin);
    const tenant = await AppDataSource.getRepository(Tenant)
      .createQueryBuilder('tenant')
      .where('tenant.isActive = true')
      .andWhere('(tenant.slug = :domain OR JSON_CONTAINS(tenant.allowedDomains, :domainJson))', {
        domain,
        domainJson: JSON.stringify(domain),
      })
      .getOne();

    callback(null, {
      origin: Boolean(tenant),
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
  } catch (error) {
    callback(error as Error);
  }
}
