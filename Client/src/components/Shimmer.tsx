import "../styles/shimmer.css";
const ShimmerWrapper = ({ isLoading, children }) => {
  return (
    <>
      {isLoading ? (
        <div className="shimmer">
          <div className="stroke animate title transparent">{children}</div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ShimmerWrapper;
