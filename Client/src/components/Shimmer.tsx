import "../styles/shimmer.css";

interface ShimmerProps {
  isLoading: boolean;
  children: React.ReactNode;
  width?: string;
}

const ShimmerWrapper = ({ isLoading, children, width }: ShimmerProps) => {
  return (
    <>
      {isLoading ? (
        <div className="shimmer-container" style={{ width: width }}>
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
