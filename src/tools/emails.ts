import { z } from "zod";
import { hubspot } from "../client.js";

export const ListEmailCampaignsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25).optional(),
  offset: z.number().int().default(0).optional(),
});

export async function listEmailCampaigns(args: z.infer<typeof ListEmailCampaignsSchema>) {
  return hubspot("/marketing-emails/v1/emails", "GET", undefined, {
    limit: args.limit ?? 25,
    offset: args.offset ?? 0,
    orderBy: "-updated",
    property: "id,name,subject,currentState,updatedAt,publishedAt,stats",
  });
}

export const GetEmailCampaignStatsSchema = z.object({
  emailId: z.number().int().describe("HubSpot marketing email ID"),
});

export async function getEmailCampaignStats(args: z.infer<typeof GetEmailCampaignStatsSchema>) {
  const [details, stats] = await Promise.all([
    hubspot(`/marketing-emails/v1/emails/${args.emailId}`),
    hubspot(`/marketing-emails/v1/emails/${args.emailId}/statistics/summary`),
  ]);
  return { details, stats };
}

export const ListMarketingEmailsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20).optional(),
  state: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional()
    .describe("Filter by publication state"),
});

export async function listMarketingEmails(args: z.infer<typeof ListMarketingEmailsSchema>) {
  const params: Record<string, string | number | boolean> = {
    limit: args.limit ?? 20,
    offset: 0,
    orderBy: "-updatedAt",
  };
  if (args.state) params.state = args.state;
  return hubspot("/marketing-emails/v1/emails", "GET", undefined, params);
}
