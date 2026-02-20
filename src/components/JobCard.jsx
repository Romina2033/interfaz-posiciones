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
          headers: {
            "Content-Type": "application/json",
          },
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
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0 }}>{job.title}</h3>
      {job.description && (
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          {job.description}
        </p>
      )}

      <input
        type="text"
        placeholder="URL de tu repo GitHub"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginTop: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
        disabled={status === "loading" || status === "success"}
      />

      <button
        onClick={handleSubmit}
        disabled={status === "loading" || status === "success"}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "none",
          backgroundColor:
            status === "success" ? "green" : status === "error" ? "red" : "#007bff",
          color: "#fff",
          cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading"
          ? "Enviando..."
          : status === "success"
          ? "Enviado ✔"
          : "Submit"}
      </button>

      {status === "error" && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>
      )}
    </div>
  );
}

export default JobCard;