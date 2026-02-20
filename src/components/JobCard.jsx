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
      
        const errorMsg = data.details?.fieldErrors 
          ? Object.values(data.details.fieldErrors).flat()[0] 
          : (data.message || 'Error en los datos');
        throw new Error(errorMsg);
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ ' + error.message);
    }
  };

export default JobCard;