# meta-migration

A CLI tool for migrating Shopify store data (metaobject definitions, metafield definitions) from one store to another using the Shopify GraphiQL app.

## Prerequisites

Install the [Shopify GraphiQL app](https://shopify-graphiql-app.shopifycloud.com/login) in both the source and target stores.

When prompted for permissions, enable the following:

**Admin API**

- `metaobject_definitions` — read, write
- `metaobjects` — read, write

**Storefront API**

- `metaobjects` — read

## How it works

All queries and mutations are run manually inside the Shopify GraphiQL app — no API tokens or custom app setup required.

### Step 1 — Query the source store

Open GraphiQL in the **source** store and run the relevant query. Save the full JSON response as the input file for the migration type you are running.

**Metaobjects query:** [`metaobjects/input/query.gql`](metaobjects/input/query.gql)

Save the response to `metaobjects/input/input.json`.

### Step 2 — Generate the mutation files

```bash
pnpm run metaobjects
```

This reads the input file and writes to `metaobjects/output/`:

- `mutation.graphql` — the shared mutation query (same for every definition)
- `{definition-type}/variables.json` — one variables file per definition

### Step 3 — Apply to the target store

Open GraphiQL in the **target** store. For each definition you want to migrate:

1. Paste `metaobjects/output/mutation.graphql` into the query editor
2. Paste the matching `metaobjects/output/{definition-type}/variables.json` into the Variables panel
3. Run the mutation
4. Check the `userErrors` field in the response — an empty array means success

## Migration types

| Type                   | Script                 | Input file                     |
| ---------------------- | ---------------------- | ------------------------------ |
| Metaobject definitions | `pnpm run metaobjects` | `metaobjects/input/input.json` |
| Metafield definitions  | `pnpm run metafields`  | `metafields/input/input.json`  |
