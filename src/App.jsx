import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Dashboard from "./components/Dashboard";
import "./index.css"; // Asegúrate de tener estos estilos

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

  return (
    <div className="app-container">

      {!receta && (
        <div className="setup-container">
          
        </div>
      )}

      {receta && (
        <div className="dashboard-container">
          <Dashboard receta={receta} lotes={lotes} />
        </div>
      )}
    </div>
  );
}

export default App;
