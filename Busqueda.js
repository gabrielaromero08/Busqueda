document.getElementById('searchDiagnosisForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const system = document.getElementById('searchSystem').value;
  const value = document.getElementById('searchValue').value;

  // Paso 1: Buscar paciente por sistema y número de documento
  fetch(`https://hl7-fhir-ehr-gabriela-787.onrender.com/patient?system=${encodeURIComponent(system)}&value=${encodeURIComponent(value)}`)
    .then(response => {
      if (response.status === 204) {
        throw new Error('❌ No se encontró un paciente con ese documento.');
      }
      return response.json();
    })
    .then(patient => {
      const patientId = patient.id;

      // Paso 2: Buscar diagnósticos (conditions) del paciente
      return fetch(`https://hl7-fhir-ehr-gabriela-787.onrender.com/condition?patient=Patient/${patientId}`);
    })
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

