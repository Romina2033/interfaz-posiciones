import { useEffect, useState } from "react";

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const email = "jane.doe@example.com";

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener candidato
        const candidateRes = await fetch(
          `${BASE_URL}/api/candidate/get-by-email?email=${email}`
        );

        if (!candidateRes.ok) {
          throw new Error("No se pudo obtener el candidato");
        }

        const candidateData = await candidateRes.json();
        setCandidate(candidateData);

        // Obtener lista de jobs
        const jobsRes = await fetch(`${BASE_URL}/api/jobs/get-list`);

        if (!jobsRes.ok) {
          throw new Error("No se pudieron obtener las posiciones");
        }

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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Posiciones abiertas</h1>

      {jobs.map((job) => (
        <div key={job.id}>
          <h3>{job.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;