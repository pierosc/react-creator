import {
  UCC,
  CC,
  JoinNewLine,
  UniqueArray,
} from "../../../../../StringFunctions";

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
    // console.log(table);9
    const isTransactional = Object.keys(table).includes("transactional");
    // console.log(table.attributes);
    let attributesRepositories = UniqueArray(
      table.attributes.map((attr) =>
        !attr.pk
          ? attr.relations.map((rel) => {
              return rel.relation !== "OneToMany"
                ? `${rel.destinyTable}Repository`
                : null;
            })
          : []
      )
    );
    let attributesRepositories2 = [];
    table.attributes.forEach((attr) => {
      if (attr.pk) {
        attr.relations.forEach((rel) => {
          if (rel.relation !== "OneToMany") {
            attributesRepositories2 = [
              ...attributesRepositories2,
              `${rel.destinyTable}Repository`,
            ];
          }
        });
      }
    });
    console.log(attributesRepositories);
    console.log(attributesRepositories2);
    if (isTransactional) {
      const transactionalRepo = `${table.transactional.name}Repository`;
      attributesRepositories2 = [...attributesRepositories2, transactionalRepo];
    }
    console.log(attributesRepositories);
    return attributesRepositories2;
  };

  const getDependencyInjection = (table) => {
    const dependencyArr = getAttributesRepositoryDependency(table);
    console.log("-----------------");
    console.log(table.name);
    console.log(dependencyArr);
    console.log("-----------------");
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

// -----Use Autowired fields or Constructor Injection (Dependency Injection)

// In Java, especially when using frameworks like Spring, you have multiple options for dependency injection: using @Autowired annotations or constructor injection. Each method has its benefits and scenarios where it might be preferred:

// @Autowired on Fields or Setters:
// Simplicity: Adding @Autowired directly on fields or setter methods can make the code straightforward and easy to read, as it clearly marks where dependencies are being injected.
// Convenience: It requires less boilerplate than constructor injection, especially when there are many dependencies or when dependencies might be optional.
// Flexibility: It allows for the setting of optional dependencies, as fields can be left uninitialized if a bean is not available.
// Constructor Injection:
// Immutability: By using constructor injection, you can declare all injected dependencies final. This approach supports immutability of your beans, which can lead to safer, easier-to-test code.
// Safety: Dependencies injected through the constructor are guaranteed to be present before the bean is used. This prevents NullPointerExceptions related to dependency injection.
// Ease of Testing: Constructor injection makes it easier to write tests because you can instantiate objects with their dependencies explicitly, without needing a Spring context.
// Clarity: It makes dependencies more explicit in the class's API, and you don't need reflection for dependency injection, which is required for field injection.
// Best Practices and Recommendations:
// Constructor Injection is generally favored in modern Spring applications for the reasons listed under its benefits. It promotes immutability and simplifies testing.
// Use @Autowired on constructors if you have a framework that supports it (like Spring does), which makes it cleaner and you can avoid using explicit autowiring in the constructor.
// Reserve field injection with @Autowired for scenarios where you absolutely need it, such as with optional dependencies or certain legacy code constraints.
// In conclusion, while @Autowired can be easier and faster for simpler applications or during rapid development phases, constructor injection is generally safer and more maintainable, making it the preferred method in most professional and scalable applications.
