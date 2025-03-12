import DashboardSkeleton from '@/components/ui/SkeletonLoader';
 
export default function Loading() {
  return <DashboardSkeleton  type="form" fields={6} />;
}