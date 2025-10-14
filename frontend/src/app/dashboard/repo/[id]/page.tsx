import RepoDetailClient from "./RepoDetailClient";

export default function RepoDetailPage({ params }: { params: { id: string } }) {
  return <RepoDetailClient id={params.id} />;
}
