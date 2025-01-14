import { registerPlugin } from '@capacitor/core';
const Source = registerPlugin('Source', {
    web: () => import('./web').then((m) => new m.SourceWeb()),
});
export * from './definitions';
export { Source };
//# sourceMappingURL=index.js.map