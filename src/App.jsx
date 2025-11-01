import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import RecetaForm from "./components/RecetaForm";
import LoteForm from "./components/LoteForm";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  const [receta, setReceta] = useState(null);
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const recetasSnap = await getDocs(collection(db, "recetas"));
      if (!recetasSnap.empty) setReceta(recetasSnap.docs[0].data());
      const lotesSnap = await getDocs(collection(db, "lotes"));
      setLotes(lotesSnap.docs.map((doc) => doc.data()));
    };
    cargarDatos();
  }, []);

  const guardarReceta = async (r) => {
    await addDoc(collection(db, "recetas"), r);
    setReceta(r);
  };

  const guardarLote = async (l) => {
    await addDoc(collection(db, "lotes"), l);
    setLotes((prev) => [...prev, l]);
  };

  return (
    <div className="container">
      <h1>🍺 Control de Lotes Cerveceros</h1>

      {!receta && (
        <>
          <h2>Configura tu receta base</h2>
          <RecetaForm onSave={guardarReceta} />
        </>
      )}

      {receta && (
        <>
          <h2>Receta base: {receta.estilo}</h2>
          <LoteForm receta={receta} onSave={guardarLote} />
          <Dashboard receta={receta} lotes={lotes} />
        </>
      )}
    </div>
  );
}

export default App;
