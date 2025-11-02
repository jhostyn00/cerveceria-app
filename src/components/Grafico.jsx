import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Métricas
const metricas = [
  { key: "temp", label: "Temperatura (°C)", color: "#d48f2a" },
  { key: "densIni", label: "Densidad Inicial", color: "#704214" },
  { key: "densFin", label: "Densidad Final", color: "#5c3300" },
  { key: "cantidad", label: "% Alcohol", color: "#2a9fd4" },
  { key: "tiempo", label: "Tiempo (días)", color: "#f28c28" },
];

export default function Grafico({ lotes = [], receta, loteSeleccionado }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMetrica, setAlertMetrica] = useState([]);

  // Encuentra el lote seleccionado
  const loteActual = lotes.find((l) => l.nombre === loteSeleccionado) || lotes[0];

  // Calcula variabilidad y controla la alerta
  useEffect(() => {
    if (!receta || !loteActual) return;

    const alertM = metricas.filter((m) => {
      const baseValue = m.key === "cantidad" ? receta.alcohol ?? 0 : receta[m.key] ?? 0;
      const loteValue = m.key === "cantidad" ? loteActual.cantidad ?? 0 : loteActual[m.key] ?? 0;

      if (baseValue == null) return false;

      const diff = Math.abs(loteValue - baseValue) / (baseValue === 0 ? 1 : baseValue);
      return diff > 0.1; // alerta si diferencia >10%
    });

    setAlertMetrica(alertM);
    setShowAlert(alertM.length > 0);
  }, [receta, loteActual, loteSeleccionado, lotes]);

  // Si no hay datos, retornamos null
  if (!receta || lotes.length === 0 || !loteSeleccionado) return null;

  // Datos para los gráficos
  const data = [
    {
      nombre: receta.estilo + " (base)",
      temp: receta.temp,
      densIni: receta.densIni,
      densFin: receta.densFin,
      cantidad: receta.alcohol ?? 0,
      tiempo: receta.tiempo,
    },
    {
      nombre: loteActual.nombre,
      temp: loteActual.temp,
      densIni: loteActual.densIni,
      densFin: loteActual.densFin,
      cantidad: loteActual.cantidad ?? 0,
      tiempo: loteActual.tiempo,
    },
  ];

  return (
    <div style={styles.outerWrapper}>
      <h2 style={styles.title}>📊 Variabilidad de Lotes – {receta.estilo}</h2>

      {/* MODAL DE ALERTA */}
      {showAlert && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: "10px" }}>⚠️ Atención: Variabilidad alta detectada</h3>
            <p>Las siguientes métricas tienen valores muy distintos del estándar:</p>
            <ul>
              {alertMetrica.map((m) => (
                <li key={m.key}>
                  {m.label}: base = {m.key === "cantidad" ? receta.alcohol ?? 0 : receta[m.key] ?? 0}, lote ={" "}
                  {m.key === "cantidad" ? loteActual.cantidad ?? 0 : loteActual[m.key] ?? 0}
                </li>
              ))}
            </ul>
            <button style={styles.closeBtn} onClick={() => setShowAlert(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* GRÁFICOS */}
      <div style={styles.grid}>
        {metricas.map((m) => (
          <div key={m.key} style={styles.chartBox}>
            <h3 style={styles.chartTitle}>{m.label}</h3>
            <div style={styles.chartResponsiveBox}>
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4a15e" opacity={0.3} />
                  <XAxis dataKey="nombre" tick={{ fill: "#704214", fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fill: "#704214", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#b78439" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffaf0",
                      border: "1px solid #c28f48",
                      borderRadius: "8px",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: "#8A4A00", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    wrapperStyle={{ fontFamily: "'Cinzel', serif", fontSize: "12px", color: "#3b2f2f" }}
                  />
                  <Line
                    type="monotone"
                    dataKey={m.key}
                    stroke={m.color}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: m.color }}
                    name={m.label}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  outerWrapper: {
    width: "100%",
    padding: "20px 0",
    fontFamily: "'Cinzel', serif",
  },
  title: {
    textAlign: "center",
    color: "#8A4A00",
    fontSize: "20px",
    marginBottom: "20px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  chartBox: {
    flex: "1 1 300px",
    maxWidth: "400px",
    background: "linear-gradient(180deg, #fff8eb 0%, #fdf1da 100%)",
    border: "2px solid #c28f48",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(138, 74, 0, 0.2)",
    minHeight: "350px",
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#8A4A00",
    fontSize: "16px",
  },
  chartResponsiveBox: {
    width: "100%",
    height: "280px",
    minWidth: 0,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fffaf0",
    padding: "25px",
    borderRadius: "12px",
    border: "2px solid #c28f48",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  closeBtn: {
    marginTop: "15px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #b78439",
    backgroundColor: "#fdf1da",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
