import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import "./App.css";

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const email = "rogonzalez2033@gmail.com";

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateRes = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${email}`);
        if (!candidateRes.ok) throw new Error("Error obteniendo candidato");
        const candidateData = await candidateRes.json();
        setCandidate(candidateData);

        const jobsRes = await fetch(`${BASE_URL}/api/jobs/get-list`);
        if (!jobsRes.ok) throw new Error("Error obteniendo posiciones");
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={centerStyle}>Cargando posiciones...</div>;
  if (error) return <div style={centerStyle}>Error: {error}</div>;

  return (
    <div className="app-container">
      <h1 className="titulo-pagina">Posiciones Abiertas</h1>
      {/* Muestra el nombre del candidato si ya cargó */}
      {candidate && (
        <p style={{ textAlign: "center", color: "#666" }}>
          Candidato: {candidate.firstName} {candidate.lastName}
        </p>
      )}
      
      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} candidateData={candidate} />
        ))}
      </div>
    </div>
  );
}

const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "1.2rem",
  color: "#4a5568"
};

export default App;