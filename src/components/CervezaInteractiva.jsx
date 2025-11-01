import { useState, useRef, useEffect } from "react";

export default function TazaInteractivaClip({ value = 50, max = 100, onChange }) {
  const [nivel, setNivel] = useState(value);
  const dragging = useRef(false);
  const svgRef = useRef(null);

  useEffect(() => setNivel(value), [value]);

  const getY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

  const handleMouseDown = (e) => { dragging.current = true; e.preventDefault(); };
  const handleMouseUp = () => { dragging.current = false; };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let newNivel = max * (1 - (getY(e) - rect.top) / rect.height);
    if (newNivel < 0) newNivel = 0;
    if (newNivel > max) newNivel = max;
    setNivel(newNivel);
    onChange && onChange(newNivel);
  };

  const porcentaje = (nivel / max);

  return (
    <svg
      ref={svgRef}
      width="100"
      height="150"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
    >
      {/* Definimos un clipPath con la forma de la taza */}
      <defs>
        <clipPath id="clipTaza">
          <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793" />
        </clipPath>
      </defs>

      {/* Rect que representa la cerveza, recortado a la taza */}
      <rect
        x="0"
        y={16 - porcentaje * 16}
        width="16"
        height={porcentaje * 16}
        fill="orange"
        clipPath="url(#clipTaza)"
      />

      {/* Contorno de la taza */}
      <path
        d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
      />
    </svg>
  );
}
