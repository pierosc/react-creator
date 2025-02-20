import React from "react";
import ChartsIndex from "./Charts/ChartsIndex";
import FormsIndex from "./Forms/FormsIndex";
import FormsConfiguration from "./Configuration/FormsConfiguration";
import TabMenu from "../../../../components/TabMenu/TabMenu";
import CustomHook from "./CustomHook/CustomHook";
import Authentication from "./Authentication/Authentication";

function ReactProjectManager() {
  return (
    <div>
      <TabMenu
        position="start"
        backgroundColor="rgba(0, 0, 0, 0)"
        menu={[
          {
            label: "CHARTS",
            content: <ChartsIndex />,
          },
          {
            label: "FORMS",
            content: <FormsConfiguration />,
          },
          {
            label: "CUSTOM HOOKS",
            content: <CustomHook />,
          },
          {
            label: "AUTHENTICATION",
            content: <Authentication />,
          },
          {
            label: "COMMANDS",
            content: <CustomHook />,
          },
        ]}
      />
    </div>
  );
}

export default ReactProjectManager;
