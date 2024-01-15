// Función para hacer la consulta GraphQL al servidor
async function fetchData() {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            persona(id: 2) {
              id
              nombre
              edad
              multas {
                id
                monto
                descripcion
              }
            }
          }
        `,
      }),
    });
  
    const result = await response.json();
    displayData(result.data.persona);
  }
  
  // Función para mostrar los datos en la interfaz
  function displayData(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h2>${data.nombre}</h2>
      <p>Edad: ${data.edad}</p>
      <h3>Multas:</h3>
      <ul>
        ${data.multas.map(multa => `
          <li>
            <strong>ID:</strong> ${multa.id}, 
            <strong>Monto:</strong> ${multa.monto}, 
            <strong>Descripción:</strong> ${multa.descripcion}
          </li>
        `).join('')}
      </ul>
    `;
  }
  
  // Llamada a la función para obtener los datos
  fetchData();
  