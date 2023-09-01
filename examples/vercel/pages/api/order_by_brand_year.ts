import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connect } from '@tidbcloud/serverless'
export const runtime = 'edge'

export default async function handler(request: NextRequest) {

  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const query = `SELECT name,COUNT(*) AS order_count FROM sold_car_orders WHERE year = ? GROUP BY name ORDER BY order_count DESC LIMIT 10`

  const conn = connect({url: process.env.DATABASE_URL})
  const response =  await conn.execute(query,[year],{fullResult:true})
  return NextResponse.json(response);
}
