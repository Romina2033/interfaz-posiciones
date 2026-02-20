const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Limpiamos estados
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

    if (response.ok) {
      setStatus('success');
      setMessage('✅ ¡Postulación enviada!');
    } else {
      // AQUÍ ESTÁ LA CLAVE: Si es 400, data suele traer el porqué
      // Puede ser que el campo sea "message", "error" o "errors"
      const errorMsg = data.message || data.error || (data.errors ? data.errors[0] : 'Error en los datos');
      throw new Error(errorMsg);
    }
  } catch (error) {
    setStatus('error');
    setMessage('❌ ' + error.message);
    console.error("Detalle del error:", error);
  }
};