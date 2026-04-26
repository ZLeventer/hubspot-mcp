import { z } from "zod";
import { hubspot } from "../client.js";

export const ListListsSchema = z.object({
  limit: z.number().int().min(1).max(500).default(50).optional(),
  query: z.string().optional().describe("Filter by list name substring"),
});

export async function listLists(args: z.infer<typeof ListListsSchema>) {
  const params: Record<string, string | number | boolean> = {
    count: args.limit ?? 50,
    offset: 0,
  };
  if (args.query) params.query = args.query;
  return hubspot("/contacts/v1/lists", "GET", undefined, params);
}

export const GetListSchema = z.object({
  listId: z.number().int().describe("HubSpot contact list ID"),
});

export async function getList(args: z.infer<typeof GetListSchema>) {
  return hubspot(`/contacts/v1/lists/${args.listId}`);
}

export const ListMembersSchema = z.object({
  listId: z.number().int().describe("HubSpot contact list ID"),
  limit: z.number().int().min(1).max(100).default(25).optional(),
});

export async function listMembers(args: z.infer<typeof ListMembersSchema>) {
  return hubspot(`/contacts/v1/lists/${args.listId}/contacts/all`, "GET", undefined, {
    count: args.limit ?? 25,
    property: "firstname,lastname,email,jobtitle,lifecyclestage",
  });
}
