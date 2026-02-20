function JobCard({ job }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
      }}
    >
      <h3 style={{ margin: 0 }}>{job.title}</h3>

      {job.description && (
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          {job.description}
        </p>
      )}
    </div>
  );
}

export default JobCard;