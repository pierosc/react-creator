import React from "react";
import SimpleLineChart from "./SimpleLineChart/SimpleLineChart";
import StackedAreaChart from "./SimpleLineChart/StackedAreaChart";

function ChartsIndex() {
  return (
    <div>
      <SimpleLineChart />
      <StackedAreaChart />
    </div>
  );
}

export default ChartsIndex;
