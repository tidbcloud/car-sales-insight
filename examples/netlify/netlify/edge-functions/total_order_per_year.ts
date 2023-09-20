import { Client,TLSMode } from "https://deno.land/x/mysql/mod.ts";

export default async () => {
  const client = await new Client().connect({
    hostname: Netlify.env.get('TIDB_HOST'),
    username: Netlify.env.get('TIDB_USER'),
    db: Netlify.env.get('TIDB_DATABASE'),
    password: Netlify.env.get('TIDB_PASSWORD'),
    port: 4000,
    tls: {
      mode: TLSMode.VERIFY_IDENTITY,
    }
  });

  const query = 'SELECT year,COUNT(*) AS order_count FROM sold_car_orders GROUP BY year ORDER BY year'
  const result = await client.query(query);
  return new Response(JSON.stringify({rows:result}),{
    headers: {
      'Access-Control-Allow-Origin': '*'
    }});
}

export const config = { path: "/api/total_order_per_year" };
