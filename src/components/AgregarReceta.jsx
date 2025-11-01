// src/components/AgregarReceta.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AgregarReceta({ onRecetaAgregada }) {
  const [nombre, setNombre] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [densidad, setDensidad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) return;

    const receta = {
      nombre,
      datos: [
        { variable: "Temperatura", valor: parseFloat(temperatura) || 0 },
        { variable: "Densidad", valor: parseFloat(densidad) || 0 },
      ],
    };

    const docRef = await addDoc(collection(db, "recetas"), receta);
    onRecetaAgregada({ id: docRef.id, ...receta });

    setNombre(""); setTemperatura(""); setDensidad("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input placeholder="Temperatura" value={temperatura} onChange={e => setTemperatura(e.target.value)} type="number"/>
      <input placeholder="Densidad" value={densidad} onChange={e => setDensidad(e.target.value)} type="number"/>
      <button type="submit">Agregar receta</button>
    </form>
  );
}
