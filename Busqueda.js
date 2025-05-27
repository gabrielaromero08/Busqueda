document.getElementById('searchDiagnosisForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const system = document.getElementById('searchSystem').value.trim();
  const value = document.getElementById('searchValue').value.trim();

  // Validar campos antes de hacer la solicitud
  if (!system || !value) {
    alert('⚠️ Por favor completa ambos campos: sistema e identificación.');
    return;
  }

  const apiUrl = `https://hl7-fhir-ehr-gabriela-787.onrender.com/condition?system=${encodeURIComponent(system)}&value=${encodeURIComponent(value)}`;

  console.log("🔍 Consultando diagnósticos en:", apiUrl);

  fetch(apiUrl)
    .then(async response => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", errorText);
        throw new Error(`❌ Error al consultar diagnósticos del paciente. Código HTTP: ${response.status}`);
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
      console.error("❗ Error al procesar la solicitud:", error);
    });
});
