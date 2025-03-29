import './LoadingBar.css';

const LoadingBar = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null; 
  return (
    <div className="loader-container">
      <div className="loader-stroke loader-animate loader-title"></div>
    </div>
  );
};

export default LoadingBar;
