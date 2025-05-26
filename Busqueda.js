document.getElementById('searchDiagnosisForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const system = document.getElementById('searchSystem').value;
  const value = document.getElementById('searchValue').value;

  // Buscar diagnósticos usando solo el número de identificación (identifier)
  // Ajusta la URL según cómo tu API espera el parámetro (por ejemplo: patient.identifier)
  fetch(`https://hl7-fhir-ehr-gabriela-787.onrender.com/condition?patient.identifier=${encodeURIComponent(system)}|${encodeURIComponent(value)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('❌ Error al consultar diagnósticos del paciente.');
      }
      return response.json();
    })
    .then(conditionData => {
      const container = document.getElementById('diagnosisResults');
      container.innerHTML = '<h3>Diagnósticos encontrados:</h3>';

      if (Array.isArray(conditionData.entry) && conditionData.entry.length > 0) {
        conditionData.entry.forEach(entry => {
          const condition = entry.resource;
          const codeDisplay = condition.code?.text || "Sin descripción";
          const status = condition.clinicalStatus?.text || "Sin estado clínico";
          const fecha = condition.onsetDateTime || "Fecha no especificada";

          container.innerHTML += `
            <div>
              <strong>Diagnóstico:</strong> ${codeDisplay}<br>
              <strong>Estado clínico:</strong> ${status}<br>
              <strong>Fecha de inicio:</strong> ${fecha}
              <hr>
            </div>
          `;
        });
      } else {
        container.innerHTML += '<p>No se encontraron diagnósticos para este paciente.</p>';
      }
    })
    .catch(error => {
      alert(error.message);
      console.error(error);
    });
});

