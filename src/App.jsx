import { useEffect, useState } from "react";
import JobCard from "./components/JobCard";
import "./App.css";

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const email = "rogonzalez2033@gmail.com";

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidateRes, jobsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/candidate/get-by-email?email=${email}`),
          fetch(`${BASE_URL}/api/jobs/get-list`)
        ]);

        const candidateData = await candidateRes.json();
        const jobsData = await jobsRes.json();
        
        setCandidate(candidateData);
        setJobs(jobsData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
      
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Posiciones Abiertas</h1>
        {candidate && (
          <p>Bienvenido, <strong>{candidate.firstName} {candidate.lastName}</strong></p>
        )}
      </header>

      <div className="jobs-grid">
        {loading ? (
          
          [...Array(6)].map((_, i) => <div key={i} className="skeleton" />)
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} candidateData={candidate} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;