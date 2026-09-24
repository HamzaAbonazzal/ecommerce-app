export default function ProductCardSkeleton() {
  return (
    <div className="glass-card h-100 overflow-hidden">
      {/* Image skeleton */}
      <div
        className="skeleton"
        style={{ aspectRatio: "4/3", borderRadius: 0 }}
      ></div>

      <div className="p-4">
        {/* Title */}
        <div
          className="skeleton mb-2"
          style={{ height: 20, width: "80%" }}
        ></div>
        <div
          className="skeleton mb-3"
          style={{ height: 16, width: "60%" }}
        ></div>

        {/* Description */}
        <div
          className="skeleton mb-2"
          style={{ height: 12, width: "100%" }}
        ></div>
        <div
          className="skeleton mb-4"
          style={{ height: 12, width: "70%" }}
        ></div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="skeleton" style={{ height: 24, width: 70 }}></div>
          <div
            className="skeleton"
            style={{ height: 36, width: 100, borderRadius: 10 }}
          ></div>
        </div>
      </div>
    </div>
  );
}
