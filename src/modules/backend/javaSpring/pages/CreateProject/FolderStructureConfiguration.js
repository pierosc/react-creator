import React, { useContext } from "react";
import { Button } from "@mui/material";
// import { TreeView } from "@mui/x-tree-view";
// import { TreeItem } from "@mui/x-tree-view";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import EditIcon from "@mui/icons-material/Edit";
import SpringContext from "../../Context/SpringProvider";
import DatabaseContext from "../../../../../context/DatabaseProvider";

function FolderStructureConfiguration({
  CloseInitialConfModal,
  handleChangeInputMenu,
  spring,
}) {
  const {
    entities,
    services,
    interfaces,
    validators,
    controllers,
    repositories,
    springProject,
  } = useContext(SpringContext);
  const { db } = useContext(DatabaseContext);

  return (
    <div
      className="flex flex-col gap-2 justify-between"
      style={{ height: "800px" }}
    >
      {/* <div className="grid gap-2">
        <label className="text-white text-center font-semibold text-lg">
          FOLDER STRUCTURE
        </label>
        <div className="grid">
          <label className="text-white">* Choose your folder structure</label>
        </div>
        <div className="flex gap-6 justify-around items-center">
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business" disabled>
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business">
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
          <div className="transition duration-300 transform hover:shadow-2xl hover:scale-105 bg-slate-400 rounded-lg">
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem nodeId="1" label="Business">
                <TreeItem nodeId="2" label="domain" />
                <TreeItem nodeId="3" label="services" />
              </TreeItem>
              <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                  <TreeItem
                    nodeId="8"
                    label="index.js"
                    ContentComponent={(props) => <File props={props} />}
                  />
                </TreeItem>
              </TreeItem>
            </TreeView>
          </div>
        </div>
      </div> */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            //   setTableStructure(getEstructure(code));
            handleChangeInputMenu("2");
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            // const initSQL = getInitSql(tableStructure);
            // setInitSQL(initSQL);

            // ----------------------------------------------------------------------------
            // SETTING EMPTY STRUCTURE FOR SERVICE, CONTROLLER, REPOSITORY, ENTITIES, DTO's

            const dataBaseStructure = db.findByName(spring.db).json;

            const repoStructure = repositories.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );
            const entitiesStructure = entities.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );
            const interfacesStructure = interfaces.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );
            const validatorStructure = validators.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );
            const servicesStructure = services.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );
            const controllersStructure = controllers.getEmptyStructure(
              dataBaseStructure,
              spring.metaData
            );

            let emptydto = {};
            dataBaseStructure.forEach((e) => {
              emptydto = { ...emptydto, [e.name]: {} };
            });

            console.group("SETTING EMPTY STRUCTURES");
            console.group("EMPTY ENTITIES STRUCTURE");
            console.log(entitiesStructure);
            console.groupEnd();
            console.group("EMPTY REPOSITORY STRUCTURE");
            console.log(repoStructure);
            console.groupEnd();
            console.group("EMPTY INTERFACES STRUCTURE");
            console.log(interfacesStructure);
            console.groupEnd();
            console.group("EMPTY SERVICES STRUCTURE");
            console.log(servicesStructure);
            console.groupEnd();
            console.group("EMPTY CONTROLLERS STRUCTURE");
            console.log(controllersStructure);
            console.groupEnd();
            console.groupEnd();

            springProject.add({
              ...spring,
              entity: entitiesStructure,
              repository: repoStructure,
              service: servicesStructure,
              interface: interfacesStructure,
              validator: validatorStructure,
              controller: controllersStructure,
              inputDTO: emptydto,
              outputDTO: emptydto,
            });
            // ---------------------------------------------------------------------
            console.log(
              "%cEMPTY PROJECT CREATED",
              "background-color: blue; color: white;"
            );
            // db.findByName(spring.db).json.forEach((e) => {
            //   // REPOSITORIES
            //   const repoImports = repositories.getImports(e, spring.metaData);
            // });

            CloseInitialConfModal();
          }}
        >
          CREATE PROJECT
        </Button>
      </div>
    </div>
  );
}

export default FolderStructureConfiguration;

// function File(props) {
//   return (
//     <div className="flex justify-between">
//       <div className="flex">
//         <div
//           className="w-4
//   "
//         ></div>
//         <label>{"label"}</label>
//       </div>
//       <div className="flex gap-1">
//         <EditIcon />
//         <EditIcon />
//       </div>
//     </div>
//   );
// }
