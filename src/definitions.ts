export interface SourcePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
