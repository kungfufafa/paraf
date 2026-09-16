import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/esignature/")({
  component: () => <Navigate to="/esignature/$folder" params={{ folder: "all-inbox" }} />,
});
