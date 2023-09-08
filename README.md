# Tinybird Demo

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tinybird Setup

Follow [Tinybird Quickstart](https://www.tinybird.co/docs/quick-start-cli.html).

Install Tinybird CLI:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install tinybird-cli
```

Go to: https://ui.tinybird.co/ to create a project and copy an admin token. Then paste it in when prompted:

```bash
tb auth
```

### Add data to Tinybird

Note, if you're running these commands on this project the files are located in the `tinybird` folder.

```bash
tb datasource generate https://storage.googleapis.com/tinybird-assets/datasets/guides/events_50M_1.csv
mv events_50M_1.datasource shopping_data.datasource
tb push shopping_data.datasource
tb datasource append shopping_data https://storage.googleapis.com/tinybird-assets/datasets/guides/events_50M_1.csv shopping_data
```

### Query data from Tinybird

Two steps:
1. Create a pipe
2. Publish an API so we can query the pipe

```bash
tb pipe generate top_10_searched_products "SELECT * FROM shopping_data WHERE event == 'search'"
```

In the file change `NODE endpoint` to `NODE search_events`.

Add a second node to the file:

```sql
NODE aggregate_by_product_id
DESCRIPTION >
    Create a count of searches aggregated by the product ID
SQL >
    SELECT product_id, count() as total FROM search_events
    GROUP BY product_id
    ORDER BY total DESC
```

Add a third node to the file:

```sql
NODE endpoint
DESCRIPTION >
    Exposes top 10 rows as an API
SQL >
    SELECT product_id, total FROM aggregate_by_product_id
    LIMIT 10
```

Push pipe to Tinybird:

```bash
tb push top_10_searched_products.pipe
```

Now we'll publish the API:

```bash
tb pipe publish top_10_searched_products
```

Congrats! Now we can query the published API.

```bash
tb pipe data top_10_searched_products
```

### Query data from Next.js app

Now that the API endpoint exists we'll make use of it in our app. See `app/api/tinybird/route.ts` for how we query the data. To add new data we can publish events using `app/api/tinybird/publish/route.ts`.
