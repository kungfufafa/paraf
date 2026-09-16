import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, useBoot } from "@/components/app-shell";
import { SendWizard } from "@/components/send-wizard";
import { useT } from "@/lib/lang";

export const Route = createFileRoute("/_app/send")({
  validateSearch: (s: Record<string, unknown>): { intent?: "emeterai"; template?: string; toEmail?: string; toName?: string } => ({
    intent: s.intent === "emeterai" ? "emeterai" : undefined,
    template: typeof s.template === "string" ? s.template : undefined,
    toEmail: typeof s.toEmail === "string" ? s.toEmail : undefined,
    toName: typeof s.toName === "string" ? s.toName : undefined,
  }),
  component: SendPage,
});

function SendPage() {
  const t = useT();
  const boot = useBoot();
  const search = Route.useSearch();
  return (
    <div>
      <PageHeader
        title={search.intent === "emeterai" ? t.requestEmeterai : t.upload}
        subtitle={
          search.intent === "emeterai"
            ? "Place eMeterai, add signers, then send."
            : "Prepare the file, recipients, fields, then send."
        }
      />
      <SendWizard
        companyName={boot.company.name}
        userName={boot.user.name}
        userEmail={boot.user.email}
        folders={boot.folders}
        intent={search.intent}
        templateId={search.template}
        toEmail={search.toEmail}
        toName={search.toName}
      />
    </div>
  );
}
