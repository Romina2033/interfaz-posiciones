import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";

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
    <div className="container">
      <header className="header">
        <h1>Posiciones Abiertas</h1>
        {candidate && <p>Candidato: {candidate.firstName} {candidate.lastName}</p>}
      </header>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} candidateData={candidate} />
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .header p {
          color: #718096;
          font-size: 1.1rem;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }
      `}</style>
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