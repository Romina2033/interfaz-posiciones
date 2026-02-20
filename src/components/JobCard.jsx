import React, { useState } from 'react';

const JobCard = ({ job, candidateData }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const validateGithubUrl = (url) => {
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/;
    return githubRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validación básica
    if (!repoUrl) {
      setStatus('error');
      setMessage('Por favor, ingresa la URL de tu repositorio.');
      return;
    }

    if (!validateGithubUrl(repoUrl)) {
      setStatus('error');
      setMessage('Ingresa una URL de GitHub válida (ej: https://github.com/usuario/repo).');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api/candidate/apply-to-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setMessage('¡Postulación enviada con éxito!');
        setRepoUrl(''); // Limpiar input tras éxito
      } else {
        throw new Error(data.message || 'Error al enviar la postulación');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Hubo un problema con la conexión.');
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className="job-id">ID: {job.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="job-card-form">
        <div className="input-group">
          <label htmlFor={`repo-${job.id}`}>Repositorio de GitHub</label>
          <input
            id={`repo-${job.id}`}
            type="url"
            placeholder="https://github.com/tu-usuario/tu-repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
          />
        </div>

        <button 
          type="submit" 
          className={`btn-submit ${status}`}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Enviando...' : status === 'success' ? '✓ Enviado' : 'Enviar Postulación'}
        </button>
      </form>

      {message && (
        <p className={`status-message ${status}`}>
          {message}
        </p>
      )}

      <style jsx>{`
        .job-card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #eee;
          transition: transform 0.2s;
        }
        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .job-card-header h3 {
          margin: 0;
          color: #1a202c;
          font-size: 1.25rem;
        }
        .job-id {
          font-size: 0.8rem;
          color: #718096;
        }
        .job-card-form {
          margin-top: 15px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }
        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4a5568;
        }
        input {
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          outline: none;
        }
        input:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        .btn-submit {
          width: 100%;
          padding: 12px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #2b6cb0;
        }
        .btn-submit:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .btn-submit.success {
          background: #48bb78;
        }
        .status-message {
          margin-top: 12px;
          font-size: 0.85rem;
          text-align: center;
        }
        .status-message.error { color: #e53e3e; }
        .status-message.success { color: #38a169; }
      `}</style>
    </div>
  );
};

export default JobCard;