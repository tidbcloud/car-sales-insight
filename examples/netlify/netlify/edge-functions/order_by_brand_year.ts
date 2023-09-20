import { Client,TLSMode } from "https://deno.land/x/mysql/mod.ts";
import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {

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

  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const query = 'SELECT name,COUNT(*) AS order_count FROM sold_car_orders WHERE year = ? GROUP BY name ORDER BY order_count DESC LIMIT 10'
  const result = await client.query(query,[year]);
  return new Response(JSON.stringify({rows:result}),{
    headers: {
      'Access-Control-Allow-Origin': '*'
    }});
}

export const config = { path: "/api/order_by_brand_year" };
