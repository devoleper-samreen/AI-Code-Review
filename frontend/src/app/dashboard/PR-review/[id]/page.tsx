import PRReviewClient from "./PRReviewClient";
import { use } from "react";

export default function PRReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PRReviewClient id={id} />;
}
