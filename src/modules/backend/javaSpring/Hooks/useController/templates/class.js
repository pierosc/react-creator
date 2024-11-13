import { CC, UCC } from "../../../../../../StringFunctions";

export const getControllerClass = (table) => {
  const controller = `@RestController
@RequestMapping("/${CC(table.name)}")
@CrossOrigin
public class ${UCC(table.name)}Controller {

   @Autowired
   private I${UCC(table.name)}Service ${CC(table.name)}Service;
`;
  return controller;
};
