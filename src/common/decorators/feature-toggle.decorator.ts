import { SetMetadata } from '@nestjs/common';

export const FEATURE_TOGGLE_KEY = 'feature_toggle_key';
export const FeatureToggle = (key: string) => SetMetadata(FEATURE_TOGGLE_KEY, key);
