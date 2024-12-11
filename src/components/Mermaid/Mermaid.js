import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Renderizar el gráfico con Mermaid
      mermaid.initialize({
        startOnLoad: true,
        theme: "dark", // Cambia el tema: 'default', 'dark', 'forest', etc.
        themeVariables: {
          primaryColor: "#1E90FF", // Cambia el color de las cajas por defecto
          edgeColor: "#FFFFFF", // Cambia el color de las flechas
          fontFamily: "Arial", // Cambia la fuente
          textColor: "#FFFFFF", // Cambia el color del texto
        },
        flowchart: {
          //   curve: "linear", // Cambia la forma de las flechas
        },
      });
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="mermaid"
      style={{ overflow: "auto", width: "100%" }}
    >
      {chart}
    </div>
  );
};

export default Mermaid;
