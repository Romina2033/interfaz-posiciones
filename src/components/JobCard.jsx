import React, { useState } from 'react';

const JobCard = ({ job, candidateData }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const validateGithubUrl = (url) => {
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;
    return githubRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl) {
      setStatus('error');
      setMessage('La URL es obligatoria');
      return;
    }
    if (!validateGithubUrl(repoUrl)) {
      setStatus('error');
      setMessage('Ingresa una URL de GitHub válida');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: candidateData.uuid,
          jobId: job.id,
          candidateId: candidateData.candidateId,
          repoUrl: repoUrl,
        }),
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        setStatus('success');
        setMessage('¡Postulación enviada!');
      } else {
        throw new Error(data.message || 'Error al enviar');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <span className="job-id">#{job.id}</span>
        <h3>{job.title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label>GitHub Repository</label>
            <input
              type="url"
              placeholder="https://github.com/usuario/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          <button 
            type="submit" 
            className={`btn ${status}`}
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Enviando...' : status === 'success' ? '✓ Postulado' : 'Postularme'}
          </button>
        </form>

        {message && <p className={`msg ${status}`}>{message}</p>}
      </div>

      <style jsx>{`
        .card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.1);
        }
        .card-content {
          padding: 24px;
        }
        .job-id {
          font-size: 0.7rem;
          color: #a0aec0;
          font-weight: bold;
          letter-spacing: 1px;
        }
        h3 {
          margin: 8px 0 20px 0;
          color: #2d3748;
          font-size: 1.25rem;
          min-height: 50px;
        }
        .input-field {
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 0.8rem;
          color: #4a5568;
          margin-bottom: 6px;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 2px solid #edf2f7;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 0.9rem;
        }
        input:focus {
          outline: none;
          border-color: #4299e1;
        }
        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          background: #4299e1;
          color: white;
          transition: background 0.2s;
        }
        .btn:hover:not(:disabled) { background: #3182ce; }
        .btn.loading { background: #a0aec0; }
        .btn.success { background: #48bb78; }
        .btn:disabled { cursor: not-allowed; }
        
        .msg {
          margin-top: 12px;
          font-size: 0.8rem;
          text-align: center;
          padding: 8px;
          border-radius: 6px;
        }
        .msg.error { color: #e53e3e; background: #fff5f5; }
        .msg.success { color: #2f855a; background: #f0fff4; }
      `}</style>
    </div>
  );
};

export default JobCard;