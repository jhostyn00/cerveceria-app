import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import CervezaInteractiva from "./CervezaInteractiva";

export default function LoteForm({ recetaId, onLotesChange }) {
  const [nombre, setNombre] = useState("");
  const [temp, setTemp] = useState(20);
  const [densIni, setDensIni] = useState(1.050);
  const [densFin, setDensFin] = useState(1.010);
  const [tiempo, setTiempo] = useState(7);
  const [cantidad, setCantidad] = useState(250);

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

    setNombre("");
    setTemp(20);
    setDensIni(1.050);
    setDensFin(1.010);
    setTiempo(7);
    setCantidad(250);
    onLotesChange();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        margin: "20px 0",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>Agregar lote real</h3>
      <input
        placeholder="Nombre del lote"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={{ marginRight: "10px" }}
      />

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div>
          <label>Temperatura (°C)</label>
          <CervezaInteractiva
            value={temp}
            onChange={(val) => setTemp(Math.round(val))} // 👈 sin decimales
            max={50}
          />
          <span>{temp} °C</span>
        </div>

        <div>
          <label>Densidad inicial</label>
          <CervezaInteractiva
            value={densIni}
            onChange={setDensIni}
            max={1.100}
          />
          <span>{densIni.toFixed(3)}</span>
        </div>

        <div>
          <label>Densidad final</label>
          <CervezaInteractiva
            value={densFin}
            onChange={setDensFin}
            max={1.100}
          />
          <span>{densFin.toFixed(3)}</span>
        </div>

        <div>
          <label>Tiempo (días)</label>
          <CervezaInteractiva
            value={tiempo}
            onChange={(val) => setTiempo(Math.round(val))} // 👈 sin decimales
            max={30}
          />
          <span>{tiempo} días</span>
        </div>

        <div>
          <label>Cantidad (ml)</label>
          <CervezaInteractiva
            value={cantidad}
            onChange={(val) => setCantidad(Math.round(val))} // 👈 sin decimales
            max={500}
          />
          <span>{cantidad} ml</span>
        </div>
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>
        Guardar lote
      </button>
    </form>
  );
}
