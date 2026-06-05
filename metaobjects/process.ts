import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface FieldType {
  name: string;
}

interface Validation {
  name: string;
  value: string;
}

interface FieldDefinition {
  key: string;
  name: string;
  required: boolean;
  description: string | null;
  type: FieldType;
  validations?: Validation[];
}

interface MetaobjectDefinition {
  name: string;
  type: string;
  description: string | null;
  fieldDefinitions: FieldDefinition[];
}

interface Input {
  data: {
    metaobjectDefinitions: {
      nodes: MetaobjectDefinition[];
    };
  };
}

const MUTATION = `mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition {
      id
      name
      type
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

function buildVariables(def: MetaobjectDefinition): object {
  return {
    definition: {
      name: def.name,
      type: def.type,
      ...(def.description ? { description: def.description } : {}),
      fieldDefinitions: def.fieldDefinitions.map((field) => ({
        key: field.key,
        name: field.name,
        type: field.type.name,
        required: field.required,
        ...(field.description ? { description: field.description } : {}),
        ...(field.validations?.length ? { validations: field.validations } : {}),
      })),
    },
  };
}

const inputPath = process.argv[2] ?? path.join(__dirname, "input/input.json");
const outputDir = process.argv[3] ?? path.join(__dirname, "output");

const raw = fs.readFileSync(inputPath, "utf-8");
const input: Input = JSON.parse(raw);
const definitions = input.data.metaobjectDefinitions.nodes;

fs.mkdirSync(outputDir, { recursive: true });

const mutationPath = path.join(outputDir, "mutation.graphql");
fs.writeFileSync(mutationPath, MUTATION);
console.log(`✓ ${mutationPath}`);

for (const def of definitions) {
  const defDir = path.join(outputDir, def.type);
  fs.mkdirSync(defDir, { recursive: true });
  const variables = buildVariables(def);
  const outPath = path.join(defDir, "variables.json");
  fs.writeFileSync(outPath, JSON.stringify(variables, null, 2));
  console.log(`✓ ${outPath}`);
}

console.log(`\nDone — ${definitions.length} definitions processed.`);
