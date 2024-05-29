import { createContext, useState, useRef } from "react";
import useSpringProject from "../modules/backend/javaSpring/Hooks/useSpringProject";

const SpringContext = createContext();

function SpringProvider({ children }) {
  const springProject = useSpringProject();
  return (
    <SpringContext.Provider
      value={{
        springProject,
      }}
    >
      {children}
    </SpringContext.Provider>
  );
}
export { SpringProvider };
export default SpringContext;
