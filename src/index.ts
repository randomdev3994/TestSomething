import { registerPlugin } from '@capacitor/core';

import type { SourcePlugin } from './definitions';

const Source = registerPlugin<SourcePlugin>('Source', {
  web: () => import('./web').then((m) => new m.SourceWeb()),
});

export * from './definitions';
export { Source };
