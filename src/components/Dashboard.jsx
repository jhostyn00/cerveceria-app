import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import RecetaForm from "./RecetaForm";
import LoteForm from "./LoteForm";
import Grafico from "./Grafico";

export default function Dashboard() {
  const [recetas, setRecetas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [loteSeleccionado, setLoteSeleccionado] = useState("");

  const fetchRecetas = async () => {
    const snapshot = await getDocs(collection(db, "recetas"));
    setRecetas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchLotes = async (recetaId) => {
    if (!recetaId) return;
    const snapshot = await getDocs(collection(db, "recetas", recetaId, "lotes"));
    const lotesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setLotes(lotesData);

    // Inicializa el lote seleccionado con el último lote disponible
    if (lotesData.length > 0) setLoteSeleccionado(lotesData[lotesData.length - 1].nombre);
    else setLoteSeleccionado("");
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  useEffect(() => {
    if (recetaSeleccionada) fetchLotes(recetaSeleccionada.id);
    else {
      setLotes([]);
      setLoteSeleccionado("");
    }
  }, [recetaSeleccionada]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
  <img src="/public/logo-ib.png" alt="Logo Inti Brew" style={styles.logo} />
  <h2 style={styles.title}>Inti Brew – Cervecería Artesanal</h2>
</div>


        <RecetaForm onRecetasChange={fetchRecetas} />

        {recetaSeleccionada && (
          <div style={styles.formBox}>
            <LoteForm
              recetaId={recetaSeleccionada.id}
              onLotesChange={() => fetchLotes(recetaSeleccionada.id)}
            />
          </div>
        )}

        {/* SELECTOR DE RECETA */}
        <div style={styles.selectorGroup}>
          <label>Seleccionar receta base:</label>
          <select
            style={styles.select}
            value={recetaSeleccionada?.id || ""}
            onChange={(e) =>
              setRecetaSeleccionada(recetas.find((r) => r.id === e.target.value) || null)
            }
          >
            <option value="">--Selecciona--</option>
            {recetas.map((r) => (
              <option key={r.id} value={r.id}>
                {r.estilo}
              </option>
            ))}
          </select>
        </div>

        {/* SELECTOR DE LOTE */}
        {lotes.length > 0 && (
          <div style={styles.selectorGroup}>
            <label>Seleccionar lote:</label>
            <select
              style={styles.select}
              value={loteSeleccionado}
              onChange={(e) => setLoteSeleccionado(e.target.value)}
            >
              {lotes.map((l) => (
                <option key={l.id} value={l.nombre}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* GRÁFICO DE LOTES */}
        {recetaSeleccionada && loteSeleccionado && (
          <Grafico lotes={lotes} receta={recetaSeleccionada} loteSeleccionado={loteSeleccionado} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {

    fontFamily: "'Cinzel', serif",

  },
  container: {
    background: "rgba(255, 248, 235, 0.95)",
    padding: "25px",
    borderRadius: "16px",
    maxWidth: "1100px",
    margin: "0 auto",
    border: "2px solid #c28f48",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    color: "#8A4A00",
    textShadow: "1px 1px #e8d2a3",
    borderBottom: "3px solid #c28f48",
    paddingBottom: "10px",
    marginBottom: "25px",
  },
  formBox: {
    marginTop: "20px",
    padding: "20px",
    background: "#fff7e6",
    borderRadius: "12px",
    border: "1px solid #d4a15e",
  },
  selectorGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #b78439",
    background: "#fff5e1",
    marginTop: "5px",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "20px",
    flexWrap: "wrap",
  },
  logo: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
  },

};
