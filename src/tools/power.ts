import { z } from "zod";
import { hubspot } from "../client.js";

const OBJECT_TYPES = ["contacts", "companies", "deals", "tickets", "products", "line_items", "quotes"] as const;

export const CrmSearchSchema = z.object({
  objectType: z.enum(OBJECT_TYPES).describe("CRM object type to search"),
  filters: z.array(z.object({
    propertyName: z.string(),
    operator: z.enum(["EQ", "NEQ", "LT", "LTE", "GT", "GTE", "BETWEEN", "IN", "NOT_IN", "HAS_PROPERTY", "NOT_HAS_PROPERTY", "CONTAINS_TOKEN", "NOT_CONTAINS_TOKEN"]),
    value: z.string().optional(),
    values: z.array(z.string()).optional(),
    highValue: z.string().optional(),
  })).describe("Filter conditions to apply"),
  properties: z.array(z.string()).optional().describe("Properties to return"),
  sorts: z.array(z.object({
    propertyName: z.string(),
    direction: z.enum(["ASCENDING", "DESCENDING"]).default("DESCENDING"),
  })).optional(),
  limit: z.number().int().min(1).max(200).default(50).optional(),
});

export async function crmSearch(args: z.infer<typeof CrmSearchSchema>) {
  return hubspot(`/crm/v3/objects/${args.objectType}/search`, "POST", {
    filterGroups: [{ filters: args.filters }],
    properties: args.properties,
    sorts: args.sorts ?? [{ propertyName: "createdate", direction: "DESCENDING" }],
    limit: args.limit ?? 50,
  });
}
