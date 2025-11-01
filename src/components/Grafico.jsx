import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Grafico({ lotes = [], receta }) {
  if (!receta) return null;

  // Transformar los datos para que sean compatibles con Recharts
  const data = lotes.map(lote => ({
    nombre: lote.nombre,
    temperatura: lote.temp,
    densidad: (lote.densIni + lote.densFin) / 2, // promedio de densidad inicial y final
    ph: lote.ph ?? 0, // si no existe, poner 0
  }));

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Variabilidad de lotes: {receta.estilo}</h3>
      <LineChart width={700} height={350} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperatura" stroke="#ff7300" />
        <Line type="monotone" dataKey="densidad" stroke="#387908" />
        <Line type="monotone" dataKey="ph" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
