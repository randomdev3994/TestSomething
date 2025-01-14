import { WebPlugin } from '@capacitor/core';
import type { SourcePlugin } from './definitions';
export declare class SourceWeb extends WebPlugin implements SourcePlugin {
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
}
