# Netlify Edge Function

Connect to the TiDB serverless from the Netlify Edge Function using [deno mysql driver](https://github.com/denodrivers/mysql).

You can deploy it with netlify cli:

```
netlify deploy
```

## Live endpoints

- [/api/avg_price_per_year](https://tidb-serverless-edge.netlify.app/api/avg_price_per_year)
- [/api/total_order_per_year](https://tidb-serverless-edge.netlify.app/api/total_order_per_year)
- [/api/order_by_brand_year](https://tidb-serverless-edge.netlify.app/api/order_by_brand_year?year=2019)
- [/api/price_by_brand_year](https://tidb-serverless-edge.netlify.app/api/price_by_brand_year?year=2019)

## Why not serverless driver?

Netlify edge runtime is based on the [Deno deploy](https://deno.com/deploy). Deno mysql driver over TCP is more suitable as we have made it compatible with TiDB serverless.

Still want to use serverless driver? Here is an example:

```
import { connect } from 'https://esm.sh/@tidbcloud/serverless'

export default async () => {
  const conn = connect({url: Netlify.env.get('DATABASE_URL')})
  const result = await conn.execute('show tables')
  return new Response(JSON.stringify(result));
}

export const config = { path: "/example" };
```
