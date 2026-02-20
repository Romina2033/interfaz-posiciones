import React, { useState } from 'react';

const JobCard = ({ job, candidateData }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!repoUrl) {
      setStatus('error');
      setMessage('⚠️ La URL es necesaria.');
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
          applicationId: candidateData.applicationId, 
          repoUrl: repoUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus('success');
        setMessage('✅ ¡Postulación enviada con éxito!');
      } else {
       
        const errorDetail = data.details?.fieldErrors 
          ? Object.values(data.details.fieldErrors).flat()[0] 
          : (data.message || 'Error en los datos');
        throw new Error(errorDetail);
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ ' + error.message);
    }
  };

  return (
    <div className="job-card">
      <span className="job-id">ID: {job.id}</span>
      <h3>{job.title}</h3>
      
      <form onSubmit={handleSubmit}>
        <label className="input-label">Repositorio de GitHub</label>
        <input
          className="input-repo"
          type="url"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
        />
        
        <button 
          type="submit" 
          className={`btn-postular ${status === 'success' ? 'success' : ''}`}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Enviando...' : status === 'success' ? 'Postulado' : 'Enviar Postulación'}
        </button>
      </form>

      {message && <div className={`mensaje ${status}`}>{message}</div>}
    </div>
  );
};


export default JobCard;