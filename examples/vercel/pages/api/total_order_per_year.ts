import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connect } from '@tidbcloud/serverless'
export const runtime = 'edge'

export default async function handler(request: NextRequest) {

  const query = 'SELECT year,COUNT(*) AS order_count FROM sold_car_orders GROUP BY year ORDER BY year'

  const conn = connect({url: process.env.DATABASE_URL})
  const response =  await conn.execute(query,null,{fullResult:true})
  return NextResponse.json(response);
}
