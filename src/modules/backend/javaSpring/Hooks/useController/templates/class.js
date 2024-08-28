import { CC, UCC } from "../../../../../../StringFunctions";

export const getControllerClass = (table) => {
  const controller = `@RestController
@RequestMapping("/${CC(table.name)}")
public class ${UCC(table.name)}Controller {
    @Autowired
    private ${UCC(table.name)}Service ${CC(table.name)}Service;
`;
  return controller;
};
