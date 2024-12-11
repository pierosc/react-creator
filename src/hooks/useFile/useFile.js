import JSZip from "jszip";

function useFile() {
  const createRarFile = async (structure) => {
    const zip = new JSZip();

    const createStructure = (parentFolder, items) => {
      items.forEach((item) => {
        if (item.type === "folder") {
          const folder = parentFolder.folder(item.name);
          if (item.content) {
            createStructure(folder, item.content);
          }
        } else if (item.type === "file") {
          parentFolder.file(item.name, item.content || "");
        }
      });
    };

    // Crear estructura a partir del JSON
    createStructure(zip, structure);

    // Generar el contenido del zip
    const content = await zip.generateAsync({ type: "blob" });

    // Crear un objeto URL para el contenido del zip
    const url = URL.createObjectURL(content);

    // Crear un enlace (link) para la descarga
    const link = document.createElement("a");
    link.href = url;
    link.download = "jpa.rar";

    // Simular un clic en el enlace para iniciar la descarga
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };

  function downloadFile(code, filename, extension = "java") {
    const text = code;
    const blob = new Blob([text], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = extension !== "" ? `${filename}.${extension}` : filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return { createRarFile, downloadFile };
}

export default useFile;
