// @deno-types="../netlify/vendor/mysql.d.ts"
import { Client, TLSMode } from "../netlify/vendor/mysql.js";
import avgPrice, {
  config as avgConfig,
} from "../netlify/edge-functions/avg_price_per_year.ts";
import totalOrders, {
  config as totalConfig,
} from "../netlify/edge-functions/total_order_per_year.ts";
import ordersByBrand, {
  config as ordersConfig,
} from "../netlify/edge-functions/order_by_brand_year.ts";
import pricesByBrand, {
  config as pricesConfig,
} from "../netlify/edge-functions/price_by_brand_year.ts";

declare global {
  const Netlify: { env: { get(name: string): string | undefined } };
}

function equal(actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

Deno.test("all handlers retain verified TLS, response shape, and bound year values offline", async () => {
  const env: Record<string, string> = {
    TIDB_HOST: "database.invalid",
    TIDB_USER: "test-user",
    TIDB_DATABASE: "test-db",
    TIDB_PASSWORD: "test-only-password",
  };
  const previousNetlify = Object.getOwnPropertyDescriptor(
    globalThis,
    "Netlify",
  );
  Object.defineProperty(globalThis, "Netlify", {
    configurable: true,
    value: { env: { get: (name: string) => env[name] } },
  });
  const originalQuery = Client.prototype.query;
  const calls: {
    sql: string;
    params?: unknown[];
    config: Record<string, unknown>;
  }[] = [];
  const rows = [{ year: 2019, price: 100 }];
  Client.prototype.query = async function (sql: string, params?: unknown[]) {
    calls.push({ sql, params, config: this.config });
    await this.close();
    return rows;
  };
  try {
    const cases = [
      { handler: avgPrice, path: avgConfig.path, year: false },
      { handler: totalOrders, path: totalConfig.path, year: false },
      { handler: ordersByBrand, path: ordersConfig.path, year: true },
      { handler: pricesByBrand, path: pricesConfig.path, year: true },
    ];
    for (const { handler, path, year } of cases) {
      for (const value of year ? ["2019", "2019' OR 1=1 --", null] : [null]) {
        const url = new URL(path, "https://example.invalid");
        if (value !== null) url.searchParams.set("year", value);
        const response = await handler(new Request(url));
        equal(response.status, 200);
        equal(response.headers.get("Access-Control-Allow-Origin"), "*");
        equal(await response.json(), { rows });
        const call = calls.at(-1)!;
        equal(call.config.hostname, env.TIDB_HOST);
        equal(call.config.username, env.TIDB_USER);
        equal(call.config.db, env.TIDB_DATABASE);
        equal(call.config.password, env.TIDB_PASSWORD);
        equal(call.config.port, 4000);
        equal(call.config.tls, { mode: TLSMode.VERIFY_IDENTITY });
        equal(TLSMode.VERIFY_IDENTITY, "verify_identity");
        equal(call.params, year ? [value] : undefined);
        equal(call.sql.includes("WHERE year = ?"), year);
        if (year && value !== null) equal(call.sql.includes(value), false);
      }
    }
  } finally {
    Client.prototype.query = originalQuery;
    if (previousNetlify) {
      Object.defineProperty(globalThis, "Netlify", previousNetlify);
    } else Reflect.deleteProperty(globalThis, "Netlify");
  }
});
