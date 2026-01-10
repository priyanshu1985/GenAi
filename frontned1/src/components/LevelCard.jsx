const LevelCard = ({ level, text, locked }) => {
  return (
    <div className={`level-card ${locked ? "locked" : ""}`}>
      <h2>{level}</h2>
      <p>{locked ? "🔒 Locked" : text}</p>
    </div>
  );
};

export default LevelCard;

