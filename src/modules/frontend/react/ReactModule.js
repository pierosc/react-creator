import React from "react";
import ProjectView from "./pages/ProjectView";
import { ReactProvider } from "./Context/ReactProvider";

function ReactModule() {
  return (
    <div className="p-6">
      <ReactProvider>
        <ProjectView />
      </ReactProvider>
    </div>
  );
}

export default ReactModule;
