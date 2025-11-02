import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import CervezaInteractiva from "./CervezaInteractiva";

export default function LoteForm({ recetaId, onLotesChange }) {
  const [nombre, setNombre] = useState("");
  const [temp, setTemp] = useState(20);
  const [densIni, setDensIni] = useState(1.05);
  const [densFin, setDensFin] = useState(1.01);
  const [tiempo, setTiempo] = useState(7);
  const [cantidad, setCantidad] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recetaId) return;

    await addDoc(collection(db, "recetas", recetaId, "lotes"), {
      nombre,
      temp,
      densIni,
      densFin,
      tiempo,
      cantidad,
    });

    // Reset
    setNombre("");
    setTemp(20);
    setDensIni(1.05);
    setDensFin(1.01);
    setTiempo(7);
    setCantidad(0);
    onLotesChange();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h3 style={styles.title}>Agregar Lote Real</h3>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Nombre del lote</label>
        <input
          placeholder="Ej. Lote Cusqueña Dorada"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.parametersRow}>
        <div style={styles.paramBox}>
          <label style={styles.label}>Temp (°C)</label>
          <CervezaInteractiva
            value={temp}
            onChange={(val) => setTemp(Math.round(val))}
            max={50}
          />
          <span style={styles.valueText}>{temp} °C</span>
        </div>

        <div style={styles.paramBox}>
          <label style={styles.label}>Dens. Inicial</label>
          <CervezaInteractiva
            value={densIni}
            onChange={setDensIni}
            max={1.1}
          />
          <span style={styles.valueText}>{densIni.toFixed(3)}</span>
        </div>

        <div style={styles.paramBox}>
          <label style={styles.label}>Dens. Final</label>
          <CervezaInteractiva
            value={densFin}
            onChange={setDensFin}
            max={1.1}
          />
          <span style={styles.valueText}>{densFin.toFixed(3)}</span>
        </div>

        <div style={styles.paramBox}>
          <label style={styles.label}>Tiempo (días)</label>
          <CervezaInteractiva
            value={tiempo}
            onChange={(val) => setTiempo(Math.round(val))}
            max={30}
          />
          <span style={styles.valueText}>{tiempo} días</span>
        </div>

        <div style={styles.paramBox}>
          <label style={styles.label}>Alcohol (%)</label>
          <CervezaInteractiva
            value={cantidad}
            onChange={(val) => setCantidad(Math.round(val))}
            max={100}
          />
          <span style={styles.valueText}>{cantidad} %</span>
        </div>
      </div>

      <button type="submit" style={styles.button}>
        Guardar Lote 🍺
      </button>
    </form>
  );
}

// 🎨 Estilos Cuzqueños Compactos
const styles = {
  formContainer: {
    background: "linear-gradient(180deg, #fff8eb 0%, #fdf1da 100%)",
    border: "2px solid #c28f48",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 auto",
    maxWidth: "750px",
    boxShadow: "0 4px 12px rgba(138, 74, 0, 0.2)",
    fontFamily: "'Cinzel', serif",
    color: "#3b2f2f",
  },
  title: {
    textAlign: "center",
    color: "#8A4A00",
    fontSize: "20px",
    marginBottom: "15px",
    textShadow: "1px 1px #f1d6a5",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#704214",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #b78439",
    background: "#fff5e1",
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
  },
  parametersRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "10px",
  },
  paramBox: {
    flex: "1 1 140px",
    background: "#fffaf0",
    border: "1px solid #d4a15e",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
  },
  valueText: {
    display: "block",
    marginTop: "5px",
    color: "#8A4A00",
    fontWeight: "bold",
    fontSize: "13px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 25px",
    background: "linear-gradient(180deg, #8A4A00, #5c3300)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 3px #3e2400",
    transition: "transform 0.1s, box-shadow 0.1s",
  },
};
