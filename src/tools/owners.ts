import { z } from "zod";
import { hubspot } from "../client.js";

export const ListOwnersSchema = z.object({
  email: z.string().email().optional().describe("Filter by owner email address"),
  includeInactive: z.boolean().default(false).optional(),
});

export async function listOwners(args: z.infer<typeof ListOwnersSchema>) {
  const params: Record<string, string | number | boolean> = {};
  if (args.email) params.email = args.email;
  if (args.includeInactive) params.includeInactive = true;
  return hubspot("/crm/v3/owners", "GET", undefined, Object.keys(params).length ? params : undefined);
}
