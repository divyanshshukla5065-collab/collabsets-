
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = 'rect' }) => {
  const baseClass = "animate-pulse bg-slate-200 dark:bg-slate-800";
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';
  
  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton variant="rect" className="w-16 h-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="text" className="w-20 h-3" />
        </div>
      </div>
      <div className="space-y-1">
        <Skeleton variant="text" className="w-12 h-2 ml-auto" />
        <Skeleton variant="text" className="w-16 h-4 ml-auto" />
      </div>
    </div>
    <div className="flex gap-4">
      <Skeleton variant="rect" className="flex-1 h-10 rounded-xl" />
      <Skeleton variant="rect" className="flex-1 h-10 rounded-xl" />
    </div>
    <Skeleton variant="rect" className="w-full h-14 rounded-2xl" />
  </div>
);
