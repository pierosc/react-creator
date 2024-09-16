import React from "react";
import ProjectView from "./pages/ProjectView";
import { SpringProvider } from "./Context/SpringProvider";

function JavaModule() {
  return (
    <div className="p-6">
      {/* <SpringProvider> */}
      <ProjectView />
      {/* </SpringProvider> */}
    </div>
  );
}

export default JavaModule;
