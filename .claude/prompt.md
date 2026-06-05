---

**_ Initial prompt _**

---

i want to create a new tool that helps to create graphql mutations(mutation query + input vars) based on the result of the graphql query.

# general description

this tool is used to migrate metaobject definitions from one Shopify store to another.

# user workflow

- user runs a query to get the definitions from store A
- user saves the query into an input.json file
- user runs a script in a cli that reads the input and generates files for mutation query + input variables

# shopify documentation:

- metaobjectDefinitions query: https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjectDefinitions
- metaobjectDefinitionCreate mutation: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectDefinitionCreate?language=graphql

---

**_ Follow up _**

---

- I want you to use the following structure for the tool's data:

metaobjects
|-input
|-output
process.js

add everything into a metaobject folder, as this is just for migrating metaobjects and later we will have another one for the metafields.
