import LoadingComponent from "@/components/Loading/LoadingComponent";
import { Suspense } from "react";

export default function Loading() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <LoadingComponent />
    </Suspense>
  );
}
