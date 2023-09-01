import { connect } from '@tidbcloud/serverless'

export interface Env {
	DATABASE_URL: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url)
		const pathname = url.pathname
		const search = url.searchParams
		const year = search.get('year')

		const conn = connect({url:env.DATABASE_URL})
		let query = ''
		let resp
		switch (pathname) {
			case '/api/avg_price_per_year':
				query = 'SELECT year, AVG( selling_price ) AS price FROM sold_car_orders GROUP BY year ORDER By year'
				resp = await conn.execute(query, null, {fullResult: true})
				break;
			case '/api/price_by_brand_year':
				query = `SELECT DISTINCT name,selling_price as price FROM sold_car_orders WHERE year = ? ORDER BY selling_price DESC LIMIT 10`
				resp = await conn.execute(query, [year], {fullResult: true})
				break;
			case '/api/order_by_brand_year':
				query = `SELECT name,COUNT(*) AS order_count FROM sold_car_orders WHERE year = ? GROUP BY name ORDER BY order_count DESC LIMIT 10`
				resp = await conn.execute(query, [year], {fullResult: true})
				break;
			case '/api/total_order_per_year':
				query = 'SELECT year,COUNT(*) AS order_count FROM sold_car_orders GROUP BY year ORDER BY year'
				resp = await conn.execute(query, null, {fullResult: true})
		}

		let response
		if (query != '') {
			response = new Response(JSON.stringify(resp))
		}else{
			response = new Response('Not Found', {status: 404})
		}
		response.headers.set("Access-Control-Allow-Origin", "*")
		response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		return response
	},
};
