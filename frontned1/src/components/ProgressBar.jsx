const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-wrapper">
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }}></div>
      </div>
      <span>{progress}% Complete</span>
    </div>
  );
};

export default ProgressBar;
