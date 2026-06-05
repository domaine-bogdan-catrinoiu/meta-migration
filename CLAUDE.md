# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run metaobjects   # generate mutation + variables files from metaobjects/input/input.json
pnpm run metafields    # generate mutation + variables files from metafields/input/input.json (future)
```

## Architecture

This is a migration tool for copying Shopify store data between stores. Each migration type lives in its own subfolder (`metaobjects/`, `metafields/`). The root `package.json` and `tsconfig.json` are shared across all migration types; there are no per-subfolder configs.

### Workflow

1. User runs a GraphQL query in the **source** store's Shopify GraphiQL app and saves the response as `{type}/input/input.json`
2. User runs the corresponding `pnpm run {type}` script — it reads the input and generates output files
3. User pastes `{type}/output/mutation.graphql` + each `{type}/output/{definition}/variables.json` into the **target** store's GraphiQL app

### metaobjects

- **Input**: `metaobjects/input/input.json` — response from the `metaobjectDefinitions` query (nodes with `name`, `type`, `description`, `fieldDefinitions[{ key, name, required, description, type { name }, validations }]`)
- **Script**: `metaobjects/process.ts` — reads input, writes one shared `mutation.graphql` and one `variables.json` per definition under `metaobjects/output/{definition-type}/`
- **Key transform**: `fieldDefinition.type.name` (nested) is flattened to `fieldDefinition.type` (string) in the mutation variables; null/empty `description` fields are omitted

### Adding a new migration type

Create a new subfolder (e.g. `metafields/`) mirroring the `metaobjects/` structure, add a script entry to the root `package.json`, and resolve default paths with `import.meta.url` so the script works when invoked from the repo root.
