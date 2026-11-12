# Netlify Edge Function

Connect to the TiDB serverless from the Netlify Edge Function using [deno mysql driver](https://github.com/denodrivers/mysql).

You can deploy it with netlify cli:

```
netlify deploy
```

## Dependency integrity

The four edge functions use the committed local bundle in
`netlify/vendor/mysql.js`. Its source is pinned to mysql **v2.12.1** in
`deps/mysql.ts`; `deno.lock` records the hashes of the complete remote graph.
Deployment does not fetch the database driver from a registry. A standalone
`deno.lock` is not sufficient for Netlify's separate edge bundling step.

To update the driver, use Deno **2.5.6** from this directory:

```sh
# Edit the version in deps/mysql.ts first, then deliberately update the lock.
deno cache --frozen=false deps/mysql.ts
npm run edge:bundle
npm run test:edge
```

Review the changed source, hashes, generated bundle, and third-party licenses
before committing. Normal bundle generation uses the frozen lockfile and
rejects changed dependency contents. Do not run dependency updates with
production database credentials in the environment.

## Database credentials

Give this example its own database user with only `SELECT` on
`sold_car_orders`. Store `TIDB_HOST`, `TIDB_USER`, `TIDB_DATABASE`, and
`TIDB_PASSWORD` in Netlify environment variables scoped to the intended
deployment; use a separate user for previews.

To rotate credentials, create a replacement read-only database user, update
the Netlify environment variables, and redeploy the reviewed bundle. Verify
the four endpoints before revoking the old user's access and retiring old
deployments that used it. If compromise is suspected, revoke the affected
user immediately, disable affected deployments, review database access and
build/deploy logs, and restore service with new credentials and a trusted
build. Pinning dependencies does not invalidate previously exposed secrets.

## Live endpoints

- [/api/avg_price_per_year](https://tidb-serverless-edge.netlify.app/api/avg_price_per_year)
- [/api/total_order_per_year](https://tidb-serverless-edge.netlify.app/api/total_order_per_year)
- [/api/order_by_brand_year](https://tidb-serverless-edge.netlify.app/api/order_by_brand_year?year=2019)
- [/api/price_by_brand_year](https://tidb-serverless-edge.netlify.app/api/price_by_brand_year?year=2019)

## Why not serverless driver?

Netlify edge runtime is based on the [Deno deploy](https://deno.com/deploy). Deno mysql driver over TCP is more suitable as we have made it compatible with TiDB serverless.

Still want to use serverless driver? First create `deps/serverless.ts`:

```ts
export { connect } from 'https://esm.sh/@tidbcloud/serverless@0.0.3'
```

Lock and bundle it with the same Deno version, then review and commit the
updated lockfile, bundle, and its licenses:

```sh
deno cache --frozen=false deps/serverless.ts
deno bundle --frozen --output=netlify/vendor/serverless.js deps/serverless.ts
```

The edge function can then use the local bundle:

```
import { connect } from '../vendor/serverless.js'

export default async () => {
  const conn = connect({url: Netlify.env.get('DATABASE_URL')})
  const result = await conn.execute('show tables')
  return new Response(JSON.stringify(result));
}

export const config = { path: "/example" };
```

Do not use the remote import directly in a deployed function. The npm examples use committed
`package-lock.json` files with integrity hashes; install them with `npm ci`.
