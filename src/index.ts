#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ok, err } from "./client.js";

// Contacts
import {
  SearchContactsSchema, searchContacts,
  GetContactSchema, getContact,
  ContactByEmailSchema, contactByEmail,
  RecentContactsSchema, recentContacts,
  CreateContactSchema, createContact,
  UpdateContactSchema, updateContact,
} from "./tools/contacts.js";

// Companies
import {
  SearchCompaniesSchema, searchCompanies,
  GetCompanySchema, getCompany,
  ListCompanyContactsSchema, listCompanyContacts,
} from "./tools/companies.js";

// Deals
import {
  SearchDealsSchema, searchDeals,
  GetDealSchema, getDeal,
  DealsByStageSchema, dealsByStage,
  RecentDealsSchema, recentDeals,
} from "./tools/deals.js";

// Pipelines
import {
  ListPipelinesSchema, listPipelines,
  PipelineSummarySchema, pipelineSummary,
} from "./tools/pipelines.js";

// Lists
import {
  ListListsSchema, listLists,
  GetListSchema, getList,
  ListMembersSchema, listMembers,
} from "./tools/lists.js";

// Emails
import {
  ListEmailCampaignsSchema, listEmailCampaigns,
  GetEmailCampaignStatsSchema, getEmailCampaignStats,
  ListMarketingEmailsSchema, listMarketingEmails,
} from "./tools/emails.js";

// Forms
import {
  ListFormsSchema, listForms,
  GetFormSchema, getForm,
  FormSubmissionsSchema, formSubmissions,
} from "./tools/forms.js";

// Workflows
import {
  ListWorkflowsSchema, listWorkflows,
  GetWorkflowSchema, getWorkflow,
} from "./tools/workflows.js";

// Properties
import {
  ListPropertiesSchema, listProperties,
  GetPropertySchema, getProperty,
} from "./tools/properties.js";

// Owners
import { ListOwnersSchema, listOwners } from "./tools/owners.js";

// Power
import { CrmSearchSchema, crmSearch } from "./tools/power.js";

// ─── Server ──────────────────────────────────────────────────────────────────

const server = new McpServer({ name: "hubspot-mcp", version: "1.0.0" });

// ─── Contacts ────────────────────────────────────────────────────────────────

server.tool(
  "hs_search_contacts",
  "Full-text search across contacts by name, email, company, or any indexed field.",
  SearchContactsSchema.shape,
  async (args) => { try { return ok(await searchContacts(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_contact",
  "Retrieve a single contact by ID with all standard properties and associated company/deal IDs.",
  GetContactSchema.shape,
  async (args) => { try { return ok(await getContact(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_contact_by_email",
  "Look up contacts by exact email address. Returns up to 5 matches.",
  ContactByEmailSchema.shape,
  async (args) => { try { return ok(await contactByEmail(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_recent_contacts",
  "Most recently created contacts, optionally filtered by lifecycle stage (lead, marketingqualifiedlead, opportunity, customer, etc.).",
  RecentContactsSchema.shape,
  async (args) => { try { return ok(await recentContacts(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_create_contact",
  "Create a new HubSpot contact. Email is required; all other fields are optional.",
  CreateContactSchema.shape,
  async (args) => { try { return ok(await createContact(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_update_contact",
  "Update one or more properties on an existing contact.",
  UpdateContactSchema.shape,
  async (args) => { try { return ok(await updateContact(args)); } catch (e) { return err(e); } },
);

// ─── Companies ───────────────────────────────────────────────────────────────

server.tool(
  "hs_search_companies",
  "Full-text search across companies by name, domain, or industry.",
  SearchCompaniesSchema.shape,
  async (args) => { try { return ok(await searchCompanies(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_company",
  "Retrieve a single company by ID with all standard properties and associated contact/deal IDs.",
  GetCompanySchema.shape,
  async (args) => { try { return ok(await getCompany(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_list_company_contacts",
  "List all contacts associated with a company.",
  ListCompanyContactsSchema.shape,
  async (args) => { try { return ok(await listCompanyContacts(args)); } catch (e) { return err(e); } },
);

// ─── Deals ───────────────────────────────────────────────────────────────────

server.tool(
  "hs_search_deals",
  "Full-text search across deals by name.",
  SearchDealsSchema.shape,
  async (args) => { try { return ok(await searchDeals(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_deal",
  "Retrieve a single deal by ID with amount, stage, close date, and associated contacts/companies.",
  GetDealSchema.shape,
  async (args) => { try { return ok(await getDeal(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_deals_by_stage",
  "List deals in a specific pipeline stage, sorted by amount descending.",
  DealsByStageSchema.shape,
  async (args) => { try { return ok(await dealsByStage(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_recent_deals",
  "Most recently created deals. Pass openOnly=true to exclude closed deals.",
  RecentDealsSchema.shape,
  async (args) => { try { return ok(await recentDeals(args)); } catch (e) { return err(e); } },
);

// ─── Pipelines ───────────────────────────────────────────────────────────────

server.tool(
  "hs_list_pipelines",
  "List all CRM pipelines (deals or tickets) with their stage IDs. Use stage IDs with hs_deals_by_stage.",
  ListPipelinesSchema.shape,
  async (args) => { try { return ok(await listPipelines(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_pipeline_summary",
  "Deal counts and total amounts aggregated by pipeline stage — a quick funnel snapshot for a given pipeline.",
  PipelineSummarySchema.shape,
  async (args) => { try { return ok(await pipelineSummary(args)); } catch (e) { return err(e); } },
);

// ─── Lists ────────────────────────────────────────────────────────────────────

server.tool(
  "hs_list_lists",
  "List all HubSpot contact lists (static and active). Optionally filter by name substring.",
  ListListsSchema.shape,
  async (args) => { try { return ok(await listLists(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_list",
  "Get metadata for a specific contact list including membership count and list type.",
  GetListSchema.shape,
  async (args) => { try { return ok(await getList(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_list_members",
  "Get contacts that are members of a specific list.",
  ListMembersSchema.shape,
  async (args) => { try { return ok(await listMembers(args)); } catch (e) { return err(e); } },
);

// ─── Marketing Emails ─────────────────────────────────────────────────────────

server.tool(
  "hs_list_email_campaigns",
  "List marketing email campaigns ordered by most recently updated.",
  ListEmailCampaignsSchema.shape,
  async (args) => { try { return ok(await listEmailCampaigns(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_email_campaign_stats",
  "Get performance statistics (opens, clicks, bounces, unsubscribes) for a specific marketing email.",
  GetEmailCampaignStatsSchema.shape,
  async (args) => { try { return ok(await getEmailCampaignStats(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_list_marketing_emails",
  "List marketing emails, optionally filtered by publication state (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED).",
  ListMarketingEmailsSchema.shape,
  async (args) => { try { return ok(await listMarketingEmails(args)); } catch (e) { return err(e); } },
);

// ─── Forms ────────────────────────────────────────────────────────────────────

server.tool(
  "hs_list_forms",
  "List all HubSpot forms ordered by most recently updated.",
  ListFormsSchema.shape,
  async (args) => { try { return ok(await listForms(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_form",
  "Get full form definition including fields, required properties, and redirect settings.",
  GetFormSchema.shape,
  async (args) => { try { return ok(await getForm(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_form_submissions",
  "Get recent submissions for a form including all field values and submission timestamps.",
  FormSubmissionsSchema.shape,
  async (args) => { try { return ok(await formSubmissions(args)); } catch (e) { return err(e); } },
);

// ─── Workflows ────────────────────────────────────────────────────────────────

server.tool(
  "hs_list_workflows",
  "List all HubSpot automation workflows with name, type, and enabled status.",
  ListWorkflowsSchema.shape,
  async (args) => { try { return ok(await listWorkflows(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_workflow",
  "Get full details of a workflow including enrollment triggers, actions, and settings.",
  GetWorkflowSchema.shape,
  async (args) => { try { return ok(await getWorkflow(args)); } catch (e) { return err(e); } },
);

// ─── Properties ───────────────────────────────────────────────────────────────

server.tool(
  "hs_list_properties",
  "List all properties defined for a CRM object type. Use customOnly=true to see only custom fields.",
  ListPropertiesSchema.shape,
  async (args) => { try { return ok(await listProperties(args)); } catch (e) { return err(e); } },
);

server.tool(
  "hs_get_property",
  "Get full definition of a single CRM property including options/enum values and validation rules.",
  GetPropertySchema.shape,
  async (args) => { try { return ok(await getProperty(args)); } catch (e) { return err(e); } },
);

// ─── Owners ───────────────────────────────────────────────────────────────────

server.tool(
  "hs_list_owners",
  "List HubSpot users (owners) that can be assigned to CRM records. Filter by email to look up a specific rep.",
  ListOwnersSchema.shape,
  async (args) => { try { return ok(await listOwners(args)); } catch (e) { return err(e); } },
);

// ─── Power ────────────────────────────────────────────────────────────────────

server.tool(
  "hs_crm_search",
  "Escape hatch: run a structured CRM search with custom filter conditions against any object type. Use when preset tools don't cover your query. Docs: developers.hubspot.com/docs/api/crm/search",
  CrmSearchSchema.shape,
  async (args) => { try { return ok(await crmSearch(args)); } catch (e) { return err(e); } },
);

// ─── Transport ────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
