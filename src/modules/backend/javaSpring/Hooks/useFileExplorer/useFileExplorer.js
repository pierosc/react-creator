import { jpaFolderStructure } from "./jpaFolderStructure";

function useFileExplorer(
  metaData,
  entities,
  repositories,
  services,
  controllers,
  DTO,
  utils,
  exception,
  application,
  metaData
) {
  // let jpa = jpaFolderStructure;

  const setEntities = (content) => {
    jpa[2].content[0].content[0].content = content;
  };

  const setUtils = (content) => {
    jpa[3].content = content;
  };

  const setException = (content) => {
    jpa[4].content = content;
  };

  const createFile = () => {
    let jpa = jpaFolderStructure;
    const entityFiles = entities.files();
    jpa[2].content[0].content[0].content = entityFiles;

    const repos = repositories.files();
    jpa[2].content[0].content[1].content = repos;

    const servicesFiles = services.files();
    jpa[0].content[1].content = servicesFiles;

    const controllersFiles = controllers.files();
    jpa[1].content = [...jpa[1].content, ...controllersFiles];

    const outputDTOFiles = DTO.files("output");
    jpa[1].content[0].content = outputDTOFiles;

    const inputDTOFiles = DTO.files("input");
    jpa[0].content[0].content = inputDTOFiles;

    const utilsFiles = utils.getFolderContent();
    jpa[3].content = utilsFiles;

    const exceptionFiles = exception.getFolderContent();
    jpa[4].content = exceptionFiles;

    const applicationFile = application.getFile();
    jpa = [...jpa, applicationFile];

    jpa = [{ type: "folder", name: metaData.artifact, content: jpa }];
  };

  return {};
}

export default useFileExplorer;
