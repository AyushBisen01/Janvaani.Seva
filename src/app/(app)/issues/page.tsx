
import { Suspense } from "react";
import IssuesContent from "./IssuesContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IssuesContent />
    </Suspense>
  );
}
