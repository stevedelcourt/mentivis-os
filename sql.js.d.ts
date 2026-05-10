declare module "sql.js" {
  export class Database {
    constructor(data?: number[] | null);
    run(sql: string): void;
    exec(sql: string): { columns: string[]; values: any[][] }[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export class Statement {
    bind(values: any[]): void;
    step(): boolean;
    getAsObject(): any;
    free(): void;
  }

  export interface SqlJsConfig {
    wasmBinary?: ArrayBuffer | Uint8Array;
    locateFile?: (file: string) => string;
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<typeof Database>;
}
