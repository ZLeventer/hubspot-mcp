import { z } from "zod";
import { hubspot } from "../client.js";

export const ListWorkflowsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25).optional(),
});

export async function listWorkflows(args: z.infer<typeof ListWorkflowsSchema>) {
  const res = await hubspot<{ workflows: unknown[] }>("/automation/v3/workflows");
  const workflows = res.workflows ?? [];
  return { workflows: workflows.slice(0, args.limit ?? 25), total: workflows.length };
}

export const GetWorkflowSchema = z.object({
  workflowId: z.number().int().describe("HubSpot workflow (automation) ID"),
});

export async function getWorkflow(args: z.infer<typeof GetWorkflowSchema>) {
  return hubspot(`/automation/v3/workflows/${args.workflowId}`);
}
