import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import RecetaForm from "./RecetaForm";
import LoteForm from "./LoteForm";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [recetas, setRecetas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [comparacion, setComparacion] = useState([]);

  // Fetch recetas base
  const fetchRecetas = async () => {
    const snapshot = await getDocs(collection(db, "recetas"));
    setRecetas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Fetch lotes de una receta
  const fetchLotes = async (recetaId) => {
    if (!recetaId) return;
    const snapshot = await getDocs(collection(db, "recetas", recetaId, "lotes"));
    setLotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchRecetas(); }, []);

  useEffect(() => {
    if (recetaSeleccionada) fetchLotes(recetaSeleccionada.id);
    else setLotes([]);
    setLoteSeleccionado(null);
    setComparacion([]);
  }, [recetaSeleccionada]);

  // Crear datos para gráfico
  const ejecutarComparacion = () => {
    if (!recetaSeleccionada || !loteSeleccionado) return;

    const data = [
      { medida: "Temp (°C)", Receta: recetaSeleccionada.temp, Lote: loteSeleccionado.temp },
      { medida: "Dens. Inicial", Receta: recetaSeleccionada.densIni, Lote: loteSeleccionado.densIni },
      { medida: "Dens. Final", Receta: recetaSeleccionada.densFin, Lote: loteSeleccionado.densFin },
      { medida: "Tiempo (días)", Receta: recetaSeleccionada.tiempo, Lote: loteSeleccionado.tiempo },
      { medida: "Cantidad (ml)", Receta: 0, Lote: loteSeleccionado.cantidad }
    ];

    setComparacion(data);
  };

  return (
    <div style={{ padding:"20px" }}>
      <h2>Dashboard Cervecería</h2>

      {/* Formulario receta base */}
      <RecetaForm onRecetasChange={fetchRecetas} />

      {/* Formulario lote real */}
      {recetaSeleccionada && <LoteForm recetaId={recetaSeleccionada.id} onLotesChange={() => fetchLotes(recetaSeleccionada.id)} />}

      {/* Selección receta y lote para comparar */}
      <div style={{ marginTop:"20px" }}>
        <label>Seleccionar receta base: </label>
        <select value={recetaSeleccionada?.id || ""} onChange={e => setRecetaSeleccionada(recetas.find(r => r.id===e.target.value) || null)}>
          <option value="">--Selecciona--</option>
          {recetas.map(r => <option key={r.id} value={r.id}>{r.estilo}</option>)}
        </select>

        <label style={{ marginLeft:"20px" }}>Seleccionar lote real: </label>
        <select value={loteSeleccionado?.id || ""} onChange={e => setLoteSeleccionado(lotes.find(l => l.id===e.target.value) || null)}>
          <option value="">--Selecciona--</option>
          {lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
        </select>

        <button onClick={ejecutarComparacion} style={{ marginLeft:"20px" }}>Ejecutar</button>
      </div>

      {/* Gráfico comparativo */}
      {comparacion.length > 0 && (
        <div style={{ marginTop:"40px" }}>
          <h3>Comparación Receta vs Lote</h3>
          <LineChart width={700} height={400} data={comparacion} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="medida" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Receta" stroke="#ff7300" strokeWidth={3} />
            <Line type="monotone" dataKey="Lote" stroke="#387908" strokeWidth={3} />
          </LineChart>
        </div>
      )}
    </div>
  );
}
