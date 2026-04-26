import { z } from "zod";
import { hubspot } from "../client.js";

const DEAL_PROPS = [
  "dealname", "amount", "dealstage", "pipeline", "closedate",
  "hubspot_owner_id", "hs_deal_stage_probability", "createdate",
  "hs_is_closed_won", "hs_is_closed", "associated_contact_ids",
].join(",");

export const SearchDealsSchema = z.object({
  query: z.string().describe("Full-text search (deal name, etc.)"),
  limit: z.number().int().min(1).max(100).default(20).optional(),
});

export async function searchDeals(args: z.infer<typeof SearchDealsSchema>) {
  return hubspot("/crm/v3/objects/deals/search", "POST", {
    query: args.query,
    limit: args.limit ?? 20,
    properties: DEAL_PROPS.split(","),
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
  });
}

export const GetDealSchema = z.object({
  dealId: z.string().describe("HubSpot deal ID"),
});

export async function getDeal(args: z.infer<typeof GetDealSchema>) {
  return hubspot(`/crm/v3/objects/deals/${args.dealId}`, "GET", undefined, {
    properties: DEAL_PROPS,
    associations: "contacts,companies",
  });
}

export const DealsByStageSchema = z.object({
  pipelineId: z.string().describe("Pipeline ID (from list_pipelines)"),
  stageId: z.string().describe("Stage ID (from list_pipelines)"),
  limit: z.number().int().min(1).max(100).default(25).optional(),
});

export async function dealsByStage(args: z.infer<typeof DealsByStageSchema>) {
  return hubspot("/crm/v3/objects/deals/search", "POST", {
    filterGroups: [{
      filters: [
        { propertyName: "pipeline", operator: "EQ", value: args.pipelineId },
        { propertyName: "dealstage", operator: "EQ", value: args.stageId },
      ],
    }],
    properties: DEAL_PROPS.split(","),
    sorts: [{ propertyName: "amount", direction: "DESCENDING" }],
    limit: args.limit ?? 25,
  });
}

export const RecentDealsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25).optional(),
  openOnly: z.boolean().default(false).optional().describe("Exclude closed deals"),
});

export async function recentDeals(args: z.infer<typeof RecentDealsSchema>) {
  const filters = args.openOnly
    ? [{ propertyName: "hs_is_closed", operator: "EQ", value: "false" }]
    : [];
  return hubspot("/crm/v3/objects/deals/search", "POST", {
    filterGroups: filters.length ? [{ filters }] : [],
    properties: DEAL_PROPS.split(","),
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    limit: args.limit ?? 25,
  });
}
