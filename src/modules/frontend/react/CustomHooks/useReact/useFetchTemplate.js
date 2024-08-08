import { CC, JoinNewLine, UCC } from "../../StringFunctions";

function useFetchTemplate() {
  const optionB = `const [|functionName|, isLoading] = usePostRequest(
    process.env.REACT_APP_URL + "|url|",
    |setData|,
    |body|
    ,
    (data)=>{
        // on Success
        console.log(data)
    },
    (error)=>{
        // on Error
        console.log(error)
    }
  );`;

  const replaceDataOnTemplate = (data, template = optionB) => {
    let replacedTemplate = template;
    // console.log(data);
    replacedTemplate = replacedTemplate.replace(
      "|functionName|",
      data.functionName
    );
    replacedTemplate = replacedTemplate.replace("|url|", data.url);
    replacedTemplate = replacedTemplate.replace("|body|", data.body);
    replacedTemplate = replacedTemplate.replace("|setData|", data.setData);
    // console.log(replacedTemplate);
    return replacedTemplate;
  };

  const getFetchFunctionsFromTable = (table) => {
    let allFetchFunctions = [];
    let data;
    let attrs = [];
    table.attributes.forEach((attr) => {
      attrs = [...attrs, `${CC(attr.name)} = ${CC(attr.name)}`];
    });
    const body = `{${JoinNewLine(attrs, ",")}}`;

    // GET
    data = {
      functionName: `getAll${UCC(table.name)}`,
      url: `getAll${UCC(table.name)}`,
      //   body: body,
      setData: `set${UCC(table.name)}`,
      method: "GET",
    };
    allFetchFunctions = [...allFetchFunctions, data];

    // POST
    data = {
      functionName: `add${UCC(table.name)}`,
      url: `add${UCC(table.name)}`,
      body: body,
      setData: `set${UCC(table.name)}`,
      method: "POST",
    };
    allFetchFunctions = [...allFetchFunctions, data];

    // UPDATE
    data = {
      functionName: `edit${UCC(table.name)}`,
      url: `edit${UCC(table.name)}`,
      body: body,
      setData: `set${UCC(table.name)}`,
      method: "UPDATE",
    };
    allFetchFunctions = [...allFetchFunctions, data];

    // DELETE
    data = {
      functionName: `delete${UCC(table.name)}`,
      url: `delete${UCC(table.name)}`,
      body: body,
      setData: `set${UCC(table.name)}`,
      method: "DELETE",
    };
    allFetchFunctions = [...allFetchFunctions, data];

    // FILTER
    data = {
      functionName: `${CC(table.name)}Filter`,
      url: `${CC(table.name)}Filter`,
      body: body,
      setData: `set${UCC(table.name)}`,
      method: "POST",
    };
    allFetchFunctions = [...allFetchFunctions, data];

    // --------------

    const replacedFetchFunctions = allFetchFunctions.map((ff) =>
      replaceDataOnTemplate(ff)
    );

    return replacedFetchFunctions;
  };

  return { optionB, replaceDataOnTemplate, getFetchFunctionsFromTable };
}

export default useFetchTemplate;
