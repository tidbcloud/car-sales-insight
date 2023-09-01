# Cloudflare Workers

Connect to the TiDB serverless from the Cloudflare Workers using TiDB serverless driver.

You can deploy it with cloudflare cli:

```
npx wrangler deploy
```

## Live endpoints

- [/api/avg_price_per_year](https://tidb-serverless-edge.1136742008.workers.dev/api/avg_price_per_year)
- [/api/total_order_per_year](https://tidb-serverless-edge.1136742008.workers.dev/api/total_order_per_year)
- [/api/order_by_brand_year](https://tidb-serverless-edge.1136742008.workers.dev/api/order_by_brand_year?year=2019)
- [/api/price_by_brand_year](https://tidb-serverless-edge.1136742008.workers.dev/api/price_by_brand_year?year=2019)
