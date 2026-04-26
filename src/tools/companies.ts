import { z } from "zod";
import { hubspot } from "../client.js";

const COMPANY_PROPS = [
  "name", "domain", "industry", "numberofemployees", "annualrevenue",
  "city", "state", "country", "phone", "website",
  "hs_lead_status", "lifecyclestage", "createdate", "hubspot_owner_id",
].join(",");

export const SearchCompaniesSchema = z.object({
  query: z.string().describe("Full-text search (company name, domain, etc.)"),
  limit: z.number().int().min(1).max(100).default(20).optional(),
});

export async function searchCompanies(args: z.infer<typeof SearchCompaniesSchema>) {
  return hubspot("/crm/v3/objects/companies/search", "POST", {
    query: args.query,
    limit: args.limit ?? 20,
    properties: COMPANY_PROPS.split(","),
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
  });
}

export const GetCompanySchema = z.object({
  companyId: z.string().describe("HubSpot company ID"),
});

export async function getCompany(args: z.infer<typeof GetCompanySchema>) {
  return hubspot(`/crm/v3/objects/companies/${args.companyId}`, "GET", undefined, {
    properties: COMPANY_PROPS,
    associations: "contacts,deals",
  });
}

export const ListCompanyContactsSchema = z.object({
  companyId: z.string().describe("HubSpot company ID"),
  limit: z.number().int().min(1).max(100).default(20).optional(),
});

export async function listCompanyContacts(args: z.infer<typeof ListCompanyContactsSchema>) {
  const assoc = await hubspot<{ results: Array<{ id: string }> }>(
    `/crm/v3/objects/companies/${args.companyId}/associations/contacts`,
    "GET",
    undefined,
    { limit: args.limit ?? 20 },
  );
  const ids = assoc.results.map((r) => r.id);
  if (!ids.length) return { results: [] };
  return hubspot("/crm/v3/objects/contacts/batch/read", "POST", {
    inputs: ids.map((id) => ({ id })),
    properties: ["firstname", "lastname", "email", "jobtitle", "phone", "lifecyclestage"],
  });
}
