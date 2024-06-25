import dataGroup from "./data-group";

export default (url: string) => ({
  DATAGROUP: dataGroup(`${url}/data-group`),
});
