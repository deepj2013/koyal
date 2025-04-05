import "../styles/shimmer.css";

interface ShimmerProps {
  isLoading: boolean;
  children: React.ReactNode;
  width?: string;
  spinner?: boolean;
}

const ShimmerWrapper = ({ isLoading, children, width, spinner }: ShimmerProps) => {
  
  return (
    <>
      {isLoading ? (
        <div className="shimmer-container relative" style={{ width }}>
          {spinner && (
            <div className="spinner-overlay">
              <div className="spinner" />
            </div>
          )}
          <div className="shimmer animate">
            <div className="child-wrapper">{children}</div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ShimmerWrapper;
