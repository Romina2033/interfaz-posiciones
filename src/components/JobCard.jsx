return (
  <div className="job-card">
    <h3>{job.title}</h3>
    <form onSubmit={handleSubmit}>
      <label className="input-label">Repositorio de GitHub</label>
      <input
        className="input-repo"
        type="url"
        placeholder="https://github.com/usuario/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        disabled={status === 'loading' || status === 'success'}
      />
      <button 
        type="submit" 
        className="btn-postular"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? 'Enviando...' : status === 'success' ? '✓ Postulado' : 'Postularme'}
      </button>
    </form>
    {message && <p className={`mensaje ${status}`}>{message}</p>}
  </div>
);