import DashboardSkeleton from '@/components/ui/SkeletonLoader';
 
export default function Loading() {
  return <DashboardSkeleton  type="table" fields={8} />;
}