import React, { useContext } from "react";
import CardP from "../../../../components/Card/CardP";
import SpringContext from "../Context/SpringProvider";
import SpringProjectManager from "../SpringProjectManager";
import CreateProject from "./CreateProject/CreateProject";
import DatabaseContext from "../../../../context/DatabaseProvider";

function ProjectView() {
  const { springProject } = useContext(SpringContext);
  const { db } = useContext(DatabaseContext);

  return (
    <>
      {Object.keys(springProject.selected).length !== 0 ? (
        <SpringProjectManager />
      ) : (
        <div className="flex gap-4">
          {springProject.springProjects.map((pj, index) => (
            <CardP
              key={index}
              properties={{
                name: pj.name,
                db: pj.db,
                // framework: "spring",
                // authorization: "keyCloack",
              }}
              onClick={() => {
                springProject.setSelected(pj);
                db.setSelected(
                  db.dataBases.find((data) => data.name === pj.db)
                );
                console.log(pj);
              }}
            />
          ))}

          <CreateProject />
        </div>
      )}
    </>
  );
}

export default ProjectView;
