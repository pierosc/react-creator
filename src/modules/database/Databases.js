import React, { useContext, useState } from "react";

import DBManager from "./pages/DBManager";
import JSONMigrator from "./pages/JSONMigrator";
import TabMenu from "../../components/TabMenu/TabMenu";

function Databases() {
  return (
    <div className="grid gap-6 ">
      <TabMenu
        position="start"
        backgroundColor="rgba(0, 0, 0, 0)"
        menu={[
          {
            label: "DB DIAGRAM",
            content: <DBManager />,
          },
          {
            label: "JSON MIGRATOR",
            content: <JSONMigrator />,
          },
        ]}
      />
    </div>
  );
}

export default Databases;
