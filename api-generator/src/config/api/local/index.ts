import api from "./api";

export default (url: string) => ({
  API: api(`${url}/api`),
});
