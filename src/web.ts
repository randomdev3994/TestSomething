import { WebPlugin } from '@capacitor/core';

import type { SourcePlugin } from './definitions';

export class SourceWeb extends WebPlugin implements SourcePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
