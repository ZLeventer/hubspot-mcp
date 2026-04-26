import { z } from "zod";
import { hubspot } from "../client.js";

export const ListPipelinesSchema = z.object({
  objectType: z.enum(["deals", "tickets"]).default("deals").optional()
    .describe("CRM object type to list pipelines for"),
});

export async function listPipelines(args: z.infer<typeof ListPipelinesSchema>) {
  const type = args.objectType ?? "deals";
  return hubspot(`/crm/v3/pipelines/${type}`);
}

export const PipelineSummarySchema = z.object({
  pipelineId: z.string().describe("Pipeline ID (from list_pipelines)"),
});

export async function pipelineSummary(args: z.infer<typeof PipelineSummarySchema>) {
  const [stages, deals] = await Promise.all([
    hubspot<{ results: Array<{ id: string; label: string; displayOrder: number; metadata: { probability: string } }> }>(
      `/crm/v3/pipelines/deals/${args.pipelineId}/stages`,
    ),
    hubspot<{ results: Array<{ properties: Record<string, string> }> }>(
      "/crm/v3/objects/deals/search", "POST", {
        filterGroups: [{ filters: [{ propertyName: "pipeline", operator: "EQ", value: args.pipelineId }] }],
        properties: ["dealstage", "amount", "hs_is_closed"],
        limit: 200,
      },
    ),
  ]);

  const byStage: Record<string, { label: string; count: number; totalAmount: number }> = {};
  for (const stage of stages.results) {
    byStage[stage.id] = { label: stage.label, count: 0, totalAmount: 0 };
  }
  for (const deal of deals.results) {
    const { dealstage, amount } = deal.properties;
    if (byStage[dealstage]) {
      byStage[dealstage].count++;
      byStage[dealstage].totalAmount += parseFloat(amount ?? "0") || 0;
    }
  }

  return {
    pipelineId: args.pipelineId,
    stages: stages.results
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s) => ({
        id: s.id,
        probability: s.metadata?.probability,
        ...byStage[s.id],
        label: s.label,
      })),
  };
}
