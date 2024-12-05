import React from "react";
import DockerCompose from "./DockerCompose";
import VolumeCommands from "./VolumeCommands";
import NetworkCommands from "./NetworkCommands";
import Services from "./Services";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Docker() {
  return (
    <div
      className="grid grid-cols-5 px-8 py-4 gap-4 items-start"
      style={{ height: "90vh" }}
    >
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            id="panel1-header"
          >
            Volume Commands
          </AccordionSummary>
          <AccordionDetails>
            <VolumeCommands />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            id="panel1-header"
          >
            Network Commands
          </AccordionSummary>
          <AccordionDetails>
            <NetworkCommands />
          </AccordionDetails>
        </Accordion>
      </div>
      <Services />
      {/* <DockerCompose /> */}
    </div>
  );
}

export default Docker;
