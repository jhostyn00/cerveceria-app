import { useState, useRef, useEffect } from "react";

export default function TazaInteractivaClip({ value = 50, max = 100, onChange }) {
  const [nivel, setNivel] = useState(value);
  const dragging = useRef(false);
  const svgRef = useRef(null);

  useEffect(() => setNivel(value), [value]);

  const getY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

  const updateNivel = (clientY, rect) => {
    let newNivel = max * (1 - (clientY - rect.top) / rect.height);
    if (newNivel < 0) newNivel = 0;
    if (newNivel > max) newNivel = max;

    setNivel(newNivel);
    onChange && onChange(newNivel);
  };

  const handleStart = (e) => {
    dragging.current = true;
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!dragging.current) return;

    e.preventDefault(); // ✅ Bloquea todo scroll sin errores

    const rect = svgRef.current.getBoundingClientRect();
    const clientY = getY(e);

    updateNivel(clientY, rect);
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  // ✅ AGREGAR LISTENERS MANUALES PARA CONTROLAR passive: false
  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    // Touch events manuales — AHORA SÍ soportan preventDefault
    svg.addEventListener("touchstart", handleStart, { passive: false });
    svg.addEventListener("touchmove", handleMove, { passive: false });
    svg.addEventListener("touchend", handleEnd, { passive: false });

    return () => {
      svg.removeEventListener("touchstart", handleStart);
      svg.removeEventListener("touchmove", handleMove);
      svg.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const porcentaje = nivel / max;

  return (
    <svg
      ref={svgRef}
      width="100"
      height="150"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        touchAction: "none", // ✅ evita scroll por CSS
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        cursor: "grab",
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >

      <defs>
        <clipPath id="clipTaza">
          <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793" />
        </clipPath>
      </defs>

      <rect
        x="0"
        y={16 - porcentaje * 16}
        width="16"
        height={porcentaje * 16}
        fill="orange"
        clipPath="url(#clipTaza)"
      />

      <path
        d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"
        fill="none"
        stroke="#333"
        strokeWidth="0.5"
      />
    </svg>
  );
}
