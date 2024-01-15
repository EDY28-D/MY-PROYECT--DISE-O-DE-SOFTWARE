const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2/promise');
const cors = require('cors'); // Agrega el paquete cors

// Configuración de la conexión a MySQL para la base de datos de personas
const poolPersonas = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql_detz16',
  database: 'personas_db',
});

// Configuración de la conexión a MySQL para la base de datos de multas
const poolMultas = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql_detz16',
  database: 'multas_db',
});

// Definir el esquema GraphQL
const schema = buildSchema(`
  type Persona {
    id: Int
    nombre: String
    edad: Int
    sexo: String
    multas: [Multa]
  }

  type Multa {
    id: Int
    monto: Float
    descripcion: String
  }

  type Query {
    persona(id: Int): Persona
  }
`);

// Resolver para la consulta de una persona con sus multas
const getPersona = async ({ id }) => {
  const [rows] = await poolPersonas.query('SELECT * FROM personas WHERE id = ?', [id]);

  if (rows.length === 0) {
    return null; // No se encontró ninguna persona con el id proporcionado
  }

  const persona = rows[0];

  // Obtener las multas asociadas a la persona
  const [multas] = await poolMultas.query('SELECT * FROM multas WHERE persona_id = ?', [id]);
  persona.multas = multas;

  return persona;
};

// Root resolver
const root = {
  persona: getPersona,
};

// Configuración del servidor Express
const app = express();

// Agrega el middleware CORS antes de la configuración de GraphQL
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL en http://localhost:${PORT}/graphql`);
});
