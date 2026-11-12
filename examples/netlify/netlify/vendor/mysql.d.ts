// Types for the driver API used by this example. Runtime code is in mysql.js.
export declare enum TLSMode {
  DISABLED = "disabled",
  VERIFY_IDENTITY = "verify_identity",
}

export interface ClientConfig {
  hostname?: string;
  username?: string;
  db?: string;
  password?: string;
  port?: number;
  tls?: { mode: TLSMode; caCerts?: string[] };
}

export declare class Client {
  config: Readonly<ClientConfig>;
  connect(config: ClientConfig): Promise<Client>;
  query(sql: string, params?: unknown[]): Promise<unknown[]>;
  close(): Promise<void>;
}
