import v1 from "./v1";

export default (url: string) => ({
  V1: v1(`${url}/v1`),
});
