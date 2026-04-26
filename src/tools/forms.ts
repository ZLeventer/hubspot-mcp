import { z } from "zod";
import { hubspot } from "../client.js";

export const ListFormsSchema = z.object({
  limit: z.number().int().min(1).max(50).default(20).optional(),
});

export async function listForms(args: z.infer<typeof ListFormsSchema>) {
  return hubspot("/forms/v2/forms", "GET", undefined, {
    limit: args.limit ?? 20,
    orderBy: "updatedAt",
    direction: "desc",
  });
}

export const GetFormSchema = z.object({
  formGuid: z.string().describe("HubSpot form GUID"),
});

export async function getForm(args: z.infer<typeof GetFormSchema>) {
  return hubspot(`/forms/v2/forms/${args.formGuid}`);
}

export const FormSubmissionsSchema = z.object({
  formGuid: z.string().describe("HubSpot form GUID"),
  limit: z.number().int().min(1).max(50).default(25).optional(),
  after: z.string().optional().describe("Paging cursor from a previous call"),
});

export async function formSubmissions(args: z.infer<typeof FormSubmissionsSchema>) {
  const params: Record<string, string | number | boolean> = {
    count: args.limit ?? 25,
  };
  if (args.after) params.offset = args.after;
  return hubspot(`/form-integrations/v1/submissions/forms/${args.formGuid}`, "GET", undefined, params);
}
