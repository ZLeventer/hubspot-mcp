import { z } from "zod";
import { hubspot } from "../client.js";

const CONTACT_PROPS = [
  "firstname", "lastname", "email", "phone", "company", "jobtitle",
  "lifecyclestage", "hs_lead_status", "createdate", "lastmodifieddate",
  "hubspot_owner_id", "hs_analytics_source",
].join(",");

export const SearchContactsSchema = z.object({
  query: z.string().describe("Full-text search string (name, email, company, etc.)"),
  limit: z.number().int().min(1).max(100).default(20).optional(),
});

export async function searchContacts(args: z.infer<typeof SearchContactsSchema>) {
  return hubspot("/crm/v3/objects/contacts/search", "POST", {
    query: args.query,
    limit: args.limit ?? 20,
    properties: CONTACT_PROPS.split(","),
    sorts: [{ propertyName: "lastmodifieddate", direction: "DESCENDING" }],
  });
}

export const GetContactSchema = z.object({
  contactId: z.string().describe("HubSpot contact ID"),
});

export async function getContact(args: z.infer<typeof GetContactSchema>) {
  return hubspot(`/crm/v3/objects/contacts/${args.contactId}`, "GET", undefined, {
    properties: CONTACT_PROPS,
    associations: "companies,deals",
  });
}

export const ContactByEmailSchema = z.object({
  email: z.string().email().describe("Contact's email address"),
});

export async function contactByEmail(args: z.infer<typeof ContactByEmailSchema>) {
  return hubspot("/crm/v3/objects/contacts/search", "POST", {
    filterGroups: [{
      filters: [{ propertyName: "email", operator: "EQ", value: args.email }],
    }],
    properties: CONTACT_PROPS.split(","),
    limit: 5,
  });
}

export const RecentContactsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25).optional(),
  lifecycleStage: z.string().optional().describe("Filter by lifecycle stage, e.g. 'lead', 'marketingqualifiedlead', 'opportunity', 'customer'"),
});

export async function recentContacts(args: z.infer<typeof RecentContactsSchema>) {
  const body: Record<string, unknown> = {
    limit: args.limit ?? 25,
    properties: CONTACT_PROPS.split(","),
    sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
  };
  if (args.lifecycleStage) {
    body.filterGroups = [{
      filters: [{ propertyName: "lifecyclestage", operator: "EQ", value: args.lifecycleStage }],
    }];
  }
  return hubspot("/crm/v3/objects/contacts/search", "POST", body);
}

export const CreateContactSchema = z.object({
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobtitle: z.string().optional(),
  lifecyclestage: z.string().optional(),
});

export async function createContact(args: z.infer<typeof CreateContactSchema>) {
  const { email, ...rest } = args;
  const properties: Record<string, string> = { email };
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) properties[k] = v;
  }
  return hubspot("/crm/v3/objects/contacts", "POST", { properties });
}

export const UpdateContactSchema = z.object({
  contactId: z.string().describe("HubSpot contact ID"),
  properties: z.record(z.string()).describe("Properties to update, e.g. { jobtitle: 'VP Marketing' }"),
});

export async function updateContact(args: z.infer<typeof UpdateContactSchema>) {
  return hubspot(`/crm/v3/objects/contacts/${args.contactId}`, "PATCH", {
    properties: args.properties,
  });
}
