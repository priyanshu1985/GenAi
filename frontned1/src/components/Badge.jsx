const Badge = ({ title, locked }) => {
  return (
    <div className={`badge ${locked ? "locked" : ""}`}>
      {locked ? "❔" : title}
    </div>
  );
};

export default Badge;
