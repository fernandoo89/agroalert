export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard({ children, className = '' }) {
  return <div className={`skeleton-card ${className}`}>{children}</div>;
}

export function SkeletonPriceCard() {
  return (
    <SkeletonCard>
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 w-28 skeleton" />
        <div className="h-8 w-8 skeleton rounded-lg" />
      </div>
      <div className="h-3 w-20 skeleton mb-2" />
      <div className="h-8 w-32 skeleton" />
    </SkeletonCard>
  );
}

export function SkeletonAlertCard() {
  return (
    <SkeletonCard>
      <div className="flex justify-between">
        <div className="h-5 w-24 skeleton" />
        <div className="h-4 w-16 skeleton" />
      </div>
      <div className="h-5 w-full skeleton" />
      <div className="h-5 w-5/6 skeleton" />
      <div className="h-10 w-full skeleton rounded-lg pt-4" />
    </SkeletonCard>
  );
}

export function SkeletonRecCard() {
  return (
    <SkeletonCard>
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 skeleton" />
        <div className="h-5 w-20 skeleton rounded" />
      </div>
      <div className="h-4 w-full skeleton" />
      <div className="h-4 w-3/4 skeleton" />
    </SkeletonCard>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="p-10 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 skeleton w-full rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="p-8 space-y-5">
      <div className="h-7 w-48 skeleton" />
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="h-4 w-24 skeleton" />
          <div className="h-12 w-full skeleton rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 skeleton" />
          <div className="h-12 w-full skeleton rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 skeleton" />
        <div className="h-20 w-full skeleton rounded-xl" />
      </div>
      <div className="h-12 w-full skeleton rounded-xl" />
    </div>
  );
}
