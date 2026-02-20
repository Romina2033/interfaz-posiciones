import { useState } from "react";

function JobCard({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!repoUrl) return; // no dejar enviar vacío
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(
        "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uuid: candidate.uuid,
            candidateId: candidate.candidateId,
            jobId: job.id,
            repoUrl,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Ocurrió un error al postularte");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Error de red");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <h3 style={{ margin: 0, fontWeight: 600, fontSize: "1.25rem", color: "#333" }}>
        {job.title}
      </h3>

      {job.description && (
        <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.95rem" }}>
          {job.description}
        </p>
      )}

      <input
        type="text"
        placeholder="URL de tu repo GitHub"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        disabled={status === "loading" || status === "success"}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          marginTop: "1rem",
          borderRadius: "6px",
          border: status === "error" ? "1.5px solid #e74c3c" : "1px solid #ccc",
          outline: "none",
          fontSize: "0.95rem",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#007bff")}
        onBlur={(e) => (e.currentTarget.style.borderColor = status === "error" ? "#e74c3c" : "#ccc")}
      />

      <button
        onClick={handleSubmit}
        disabled={status === "loading" || status === "success"}
        style={{
          marginTop: "0.8rem",
          width: "100%",
          padding: "0.65rem 0",
          borderRadius: "6px",
          border: "none",
          background:
            status === "success"
              ? "#2ecc71"
              : status === "error"
              ? "#e74c3c"
              : "linear-gradient(90deg, #007bff 0%, #0056d4 100%)",
          color: "#fff",
          fontWeight: 600,
          cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          if (status === "idle") e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {status === "loading"
          ? "Enviando..."
          : status === "success"
          ? "Enviado ✔"
          : "Submit"}
      </button>

      {status === "error" && (
        <p
          style={{
            color: "#e74c3c",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
            fontStyle: "italic",
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default JobCard;