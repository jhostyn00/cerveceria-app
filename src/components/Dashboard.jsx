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

  const fetchRecetas = async () => {
    const snapshot = await getDocs(collection(db, "recetas"));
    setRecetas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

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
    <div
      style={{
        padding: "20px",
        fontFamily: "'Cinzel', serif",
         // textura andina
        minHeight: "100vh",
        color: "#3b2f2f"
      }}
    >
      <div
        style={{
          background: "rgba(255, 248, 235, 0.9)",
          padding: "30px",
          borderRadius: "16px",
          maxWidth: "1100px",
          margin: "0 auto",
          border: "2px solid #c28f48",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#8A4A00",
            textShadow: "2px 2px #e8d2a3",
            borderBottom: "3px solid #c28f48",
            paddingBottom: "10px",
            marginBottom: "30px"
          }}
        >
          Dashboard Cervecería Artesanal – Inspirado en Cuzco
        </h2>

        <RecetaForm onRecetasChange={fetchRecetas} />

        {recetaSeleccionada && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#fff7e6",
              borderRadius: "12px",
              border: "1px solid #d4a15e"
            }}
          >
            <LoteForm
              recetaId={recetaSeleccionada.id}
              onLotesChange={() => fetchLotes(recetaSeleccionada.id)}
            />
          </div>
        )}

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#ffeccc",
            borderRadius: "12px",
            border: "1px solid #c28f48",
          }}
        >
          <label>Seleccionar receta base: </label>
          <select
            style={selectStyle}
            value={recetaSeleccionada?.id || ""}
            onChange={e => setRecetaSeleccionada(recetas.find(r => r.id === e.target.value) || null)}
          >
            <option value="">--Selecciona--</option>
            {recetas.map(r => (
              <option key={r.id} value={r.id}>{r.estilo}</option>
            ))}
          </select>

          <label style={{ marginLeft: "20px" }}>Seleccionar lote real: </label>
          <select
            style={selectStyle}
            value={loteSeleccionado?.id || ""}
            onChange={e => setLoteSeleccionado(lotes.find(l => l.id === e.target.value) || null)}
          >
            <option value="">--Selecciona--</option>
            {lotes.map(l => (
              <option key={l.id} value={l.id}>{l.nombre}</option>
            ))}
          </select>

          <button style={buttonStyle} onClick={ejecutarComparacion}>
            Ejecutar Comparación
          </button>
        </div>

        {comparacion.length > 0 && (
          <div
            style={{
              marginTop: "40px",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #c28f48",
            }}
          >
            <h3 style={{ color: "#8A4A00", textAlign: "center" }}>Comparación Receta vs Lote</h3>

            <LineChart
              width={700}
              height={400}
              data={comparacion}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="medida" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Receta" stroke="#d48f2a" strokeWidth={3} />
              <Line type="monotone" dataKey="Lote" stroke="#704214" strokeWidth={3} />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #b78439",
  background: "#fff5e1",
  marginLeft: "10px",
};

const buttonStyle = {
  marginLeft: "20px",
  padding: "10px 20px",
  background: "#8A4A00",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px #5c3300",
};
