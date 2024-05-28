import React from "react";
import Commands from "./Commands";
import Installation from "./Installation";

function Kafka() {
  return (
    <div className="grid grid-cols-4 px-24 py-4 gap-4">
      <Commands />
      <Installation />
    </div>
  );
}

export default Kafka;
