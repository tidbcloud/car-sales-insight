import { Client,TLSMode } from "https://deno.land/x/mysql/mod.ts";
import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {

  const client = await new Client().connect({
    hostname: Netlify.env.get('TIDB_HOST'),
    username: Netlify.env.get('TIDB_USER'),
    db: "test",
    password: Netlify.env.get('TIDB_PASSWORD'),
    port: 4000,
    tls: {
      mode: TLSMode.VERIFY_IDENTITY,
    }
  });

  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const query = `SELECT DISTINCT name,selling_price as price FROM sold_car_orders WHERE year = ? ORDER BY selling_price DESC LIMIT 10`

  const result = await client.query(query,[year]);
  return new Response(JSON.stringify({rows:result}),{
    headers: {
      'Access-Control-Allow-Origin': '*'
    }});
}

export const config = { path: "/api/price_by_brand_year" };
