# hubspot-mcp

MCP server for HubSpot CRM — 33 tools covering contacts, companies, deals, pipelines, lists, marketing emails, forms, workflows, and properties.

## Tools

### Contacts (6)
| Tool | Description |
|------|-------------|
| `hs_search_contacts` | Full-text search across contacts |
| `hs_get_contact` | Get a contact by ID with associations |
| `hs_contact_by_email` | Look up contacts by exact email |
| `hs_recent_contacts` | Most recently created contacts, filterable by lifecycle stage |
| `hs_create_contact` | Create a new contact |
| `hs_update_contact` | Update properties on an existing contact |

### Companies (3)
| Tool | Description |
|------|-------------|
| `hs_search_companies` | Full-text search across companies |
| `hs_get_company` | Get a company by ID with associations |
| `hs_list_company_contacts` | List contacts associated with a company |

### Deals (4)
| Tool | Description |
|------|-------------|
| `hs_search_deals` | Full-text search across deals |
| `hs_get_deal` | Get a deal by ID with amount, stage, and associations |
| `hs_deals_by_stage` | List deals in a specific pipeline stage |
| `hs_recent_deals` | Most recently created deals, with optional open-only filter |

### Pipelines (2)
| Tool | Description |
|------|-------------|
| `hs_list_pipelines` | List all pipelines with stage IDs |
| `hs_pipeline_summary` | Deal counts and total amounts by stage — funnel snapshot |

### Lists (3)
| Tool | Description |
|------|-------------|
| `hs_list_lists` | List all contact lists (static and active) |
| `hs_get_list` | Get list metadata including member count |
| `hs_list_members` | Get contacts in a list |

### Marketing Emails (3)
| Tool | Description |
|------|-------------|
| `hs_list_email_campaigns` | List marketing email campaigns |
| `hs_get_email_campaign_stats` | Opens, clicks, bounces, unsubscribes for an email |
| `hs_list_marketing_emails` | List emails filtered by state (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED) |

### Forms (3)
| Tool | Description |
|------|-------------|
| `hs_list_forms` | List all HubSpot forms |
| `hs_get_form` | Get full form definition including fields |
| `hs_form_submissions` | Get recent form submissions with field values |

### Workflows (2)
| Tool | Description |
|------|-------------|
| `hs_list_workflows` | List all automation workflows |
| `hs_get_workflow` | Get full workflow details including triggers and actions |

### Properties (2)
| Tool | Description |
|------|-------------|
| `hs_list_properties` | List all CRM properties for an object type |
| `hs_get_property` | Get full property definition including enum options |

### Owners (1)
| Tool | Description |
|------|-------------|
| `hs_list_owners` | List HubSpot users that can be assigned to CRM records |

### Power / Escape Hatch (1)
| Tool | Description |
|------|-------------|
| `hs_crm_search` | Structured CRM search with custom filters against any object type |

## Setup

### 1. Get a HubSpot Private App access token

1. In HubSpot, go to **Settings → Integrations → Private Apps**
2. Create a new private app
3. Grant scopes: `crm.objects.contacts.read`, `crm.objects.companies.read`, `crm.objects.deals.read`, `crm.lists.read`, `automation`, `forms`, `marketing-email`
4. Copy the access token

### 2. Configure Claude Desktop

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "hubspot-mcp"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "pat-na1-xxxxxxxxxxxx"
      }
    }
  }
}
```

### 2a. Configure Claude Code (CLI)

```bash
claude mcp add hubspot -e HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxxxxxx -- npx -y hubspot-mcp
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HUBSPOT_ACCESS_TOKEN` | Yes | HubSpot Private App access token (`pat-na1-...`) |

## License

MIT
