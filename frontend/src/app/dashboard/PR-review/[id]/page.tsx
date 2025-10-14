import PRReviewClient from "./PRReviewClient";

export default function PRReviewPage({ params }: { params: { id: string } }) {
  return <PRReviewClient id={params.id} />;
}
