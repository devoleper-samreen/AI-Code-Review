import RepoDetailClient from "./RepoDetailClient";
import { use } from "react";

export default function RepoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RepoDetailClient id={id} />;
}
