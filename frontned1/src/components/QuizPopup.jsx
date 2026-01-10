const QuizPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>🎉 Great Job!</h2>
        <p>You answered correctly!</p>
        <button onClick={onClose}>Next</button>
      </div>
    </div>
  );
};

export default QuizPopup;
