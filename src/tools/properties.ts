import { z } from "zod";
import { hubspot } from "../client.js";

const OBJECT_TYPES = ["contacts", "companies", "deals", "tickets", "products", "line_items"] as const;

export const ListPropertiesSchema = z.object({
  objectType: z.enum(OBJECT_TYPES).describe("CRM object type"),
  customOnly: z.boolean().default(false).optional().describe("Return only custom properties"),
});

export async function listProperties(args: z.infer<typeof ListPropertiesSchema>) {
  const res = await hubspot<{ results: Array<{ name: string; label: string; type: string; fieldType: string; groupName: string; calculated: boolean }> }>(
    `/crm/v3/properties/${args.objectType}`,
  );
  const props = res.results ?? [];
  return {
    objectType: args.objectType,
    properties: (args.customOnly ? props.filter((p) => !p.calculated && p.groupName !== "contactinformation") : props)
      .map(({ name, label, type, fieldType, groupName }) => ({ name, label, type, fieldType, groupName })),
  };
}

export const GetPropertySchema = z.object({
  objectType: z.enum(OBJECT_TYPES),
  propertyName: z.string().describe("Internal property name, e.g. 'lifecyclestage'"),
});

export async function getProperty(args: z.infer<typeof GetPropertySchema>) {
  return hubspot(`/crm/v3/properties/${args.objectType}/${args.propertyName}`);
}
