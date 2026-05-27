import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_TOGGLE_KEY } from '../decorators/feature-toggle.decorator';
import { FeatureFlagsService } from '../../modules/feature-flags/feature-flags.service';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly flagsService: FeatureFlagsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const flagKey = this.reflector.getAllAndOverride<string>(FEATURE_TOGGLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!flagKey) return true;

    const request = context.switchToHttp().getRequest();
    const isAvailable = await this.flagsService.isEnabled(flagKey, request.user);
    if (!isAvailable) {
      throw new MethodNotAllowedException(`Feature is disabled for this tenant: ${flagKey}`);
    }

    return true;
  }
}
