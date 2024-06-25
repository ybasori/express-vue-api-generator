import dataStructure from "./data-structure";
import dataList from "./data-list";

export default (url: string) => ({
  INDEX: `${url}`,
  SHOW: `${url}/:uuid`,
  STRUCTURE: dataStructure(`${url}/:dataGroupUuid/structure`),
  LIST: dataList(`${url}/:dataGroupUuid/list`),
});
