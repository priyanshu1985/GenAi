const QuizCard = ({ question }) => {
  return (
    <div className="quiz-card">
      <h3>{question}</h3>
      <button className="quiz-btn">Answer 🎤</button>
    </div>
  );
};

export default QuizCard;
