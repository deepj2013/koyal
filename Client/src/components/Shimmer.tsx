import "../styles/shimmer.css";
const ShimmerWrapper = ({ isLoading, children, noContent = false }) => {
  return (
    <>
      <div className="shimmer">
        <div
          className={`${isLoading && "stroke animate title transparent"} ${
            noContent && "noContent"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default ShimmerWrapper;
