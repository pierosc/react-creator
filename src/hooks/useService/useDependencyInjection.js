import { UCC, CC, JoinNewLine, UniqueArray } from "../../StringFunctions";

function useDependencyInjection(configuration) {
  const getAutoWiredFieldInjection = (dependency) => {
    return `  @Autowired
    private ${UCC(dependency)} ${CC(dependency)};`;
  };

  //Constructor Injection

  const getDependencyDeclaration = (dependency) =>
    `private final ${UCC(dependency)} ${CC(dependency)};`;

  const getThisDependency = (dependency) =>
    `this.${CC(dependency)} = ${CC(dependency)};`;

  const getDependencyInstance = (dependency) =>
    `${UCC(dependency)} ${CC(dependency)}`;

  const getAttributesRepositoryDependency = (table) => {
    // console.log(table);
    const isTransactional = Object.keys(table).includes("transactional");

    let attributesRepositories = UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              return rel.relation !== "OneToMany"
                ? `${rel.destinyTable}Repository`
                : "";
            })
          : []
      )
    );
    // console.log(attributesRepositories);
    if (isTransactional) {
      const transactionalRepo = `${table.transactional.name}Repository`;
      attributesRepositories = [...attributesRepositories, transactionalRepo];
    }
    // console.log(attributesRepositories);
    return attributesRepositories;
  };

  const getDependencyInjection = (table) => {
    const dependencyArr = getAttributesRepositoryDependency(table);
    // console.log(dependencyArr);
    let depArr = [
      "modelMapper",
      `${UCC(table.name)}Repository`,
      ...dependencyArr,
    ].flat();
    // -------------- SELECT INJECTION MODEL --------------------------------
    // console.log(depArr);
    if (configuration) {
      const dependenciesInjectedArray = depArr.map((dep) => {
        // console.log(dep);
        return getAutoWiredFieldInjection(dep);
      });
      return `${JoinNewLine(dependenciesInjectedArray)}`;
    }
    if (!configuration) {
      const dependencyDeclarationArr = depArr.map((dep) =>
        getDependencyDeclaration(dep)
      );
      const thisDependencyArr = depArr.map((dep) => getThisDependency(dep));

      const dependencyInstanceArr = depArr.map((dep) =>
        getDependencyInstance(dep)
      );

      return `${JoinNewLine(dependencyDeclarationArr)}
      @Autowired
      public ${UCC(table.name)}Service (
      ${JoinNewLine(dependencyInstanceArr, ",")} ) {

      ${JoinNewLine(thisDependencyArr)}
    }
        `;
    }
  };

  return { getDependencyInjection };
}

export default useDependencyInjection;
