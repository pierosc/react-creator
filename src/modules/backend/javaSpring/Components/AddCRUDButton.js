import { Button } from "@mui/material";
import React, { useContext } from "react";
import SpringContext from "../Context/SpringProvider";
import DatabaseContext from "../../../../context/DatabaseProvider";

function AddCRUDButton() {
  const { db } = useContext(DatabaseContext);

  const { springProject, JPA } = useContext(SpringContext);

  return (
    <Button
      size="large"
      onClick={() => {
        const tableStructureFromDB = db?.selected?.json;

        tableStructureFromDB.forEach((table) => {
          JPA.createEntities(springProject.selected.name, table);
          JPA.createListEndpoint(springProject.selected.name, table);
          JPA.createAddEndpoint(springProject.selected.name, table);
          JPA.createEditEndpoint(springProject.selected.name, table);
          JPA.createDeleteEndpoint(springProject.selected.name, table);
          JPA.createFilterEndpoint(springProject.selected.name, table);
          JPA.createFilterExcelEndpoint(springProject.selected.name, table);
        });
      }}
    >
      Add CRUDF Service
    </Button>
  );
}

export default AddCRUDButton;
