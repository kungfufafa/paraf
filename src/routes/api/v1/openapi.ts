import { createFileRoute } from "@tanstack/react-router";

const SPEC = {
  openapi: "3.0.3",
  info: { title: "Paraf HRIS/ERP API", version: "1.0.0", description: "Inbound REST for HRIS/ERP. Auth: Bearer paraf_live_…" },
  security: [{ bearer: [] }],
  components: {
    securitySchemes: { bearer: { type: "http", scheme: "bearer", bearerFormat: "paraf_live" } },
  },
  paths: {
    "/api/v1/me": { get: { summary: "Workspace identity" } },
    "/api/v1/documents": {
      get: { summary: "List documents" },
      post: {
        summary: "Create (and optionally send) a document",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "recipients"],
                properties: {
                  title: { type: "string" },
                  docType: { type: "string" },
                  send: { type: "boolean" },
                  recipients: { type: "array", items: { type: "object", properties: { name: { type: "string" }, email: { type: "string" } } } },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/documents/{id}": {
      get: { summary: "Get one document + TSA serials" },
      post: { summary: "action=void | remind" },
    },
    "/api/v1/events": { get: { summary: "Outbound webhook delivery log" } },
    "/api/v1/hooks": {
      get: { summary: "Inbound hook contract (auth required)" },
      post: {
        summary: "HRIS → Paraf: document.create | document.sent | document.void | document.remind",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["event"],
                properties: {
                  event: { type: "string" },
                  data: { type: "object" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/tsa": { get: { summary: "Workspace timestamp chain" } },
    "/api/v1/tsa/{serial}": { get: { summary: "Public verify a Paraf TSA serial (no auth)" } },
  },
};

export const Route = createFileRoute("/api/v1/openapi")({
  server: {
    handlers: {
      GET: async () => Response.json(SPEC),
    },
  },
});
