import { PlatformNetwork } from '../platform.types';

export interface IPlatform {
  name: PlatformNetwork;
  ssid: string;
  url?: string;
  userId?: string;
}