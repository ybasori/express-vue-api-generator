import { RequestHandler } from "express";

export interface IRoute {
  path: string;
  controller?: RequestHandler;
  children?: IRoute[];
  method?: "get" | "post" | "put" | "delete";
  middleware?: RequestHandler[];
}

const onArrayForm = (
  name: string,
  data: IRoute[],
  obj: IRoute[],
  middlewares: RequestHandler[]
) => {
  let newObj: IRoute[] = [...obj];
  data.forEach((item) => {
    if (item.controller) {
      newObj = [
        ...newObj,
        {
          path: `${name !== "/" ? name : ""}${item.path}`,
          method: item.method,
          middleware: item.middleware
            ? [...middlewares, ...item.middleware]
            : [...middlewares],
          controller: item.controller,
        },
      ];
    }
    if (Array.isArray(item.children) || typeof item.children === "object") {
      newObj = onArrayForm(
        `${name !== "/" ? name : ""}${item.path}`,
        item.children,
        newObj,
        item.middleware
          ? [...middlewares, ...item.middleware]
          : [...middlewares]
      );
    }
  });
  return newObj;
};

const ExpandRouter = (data: IRoute[]) => {
  let obj: IRoute[] = [];
  data.forEach((item) => {
    if (item.controller) {
      obj = [
        ...obj,
        {
          path: item.path,
          method: item.method,
          middleware: item.middleware,
          controller: item.controller,
        },
      ];
    }
    if (Array.isArray(item.children) || typeof item.children === "object") {
      obj = onArrayForm(
        item.path,
        item.children,
        obj,
        item.middleware ? [...item.middleware] : []
      );
    }
  });
  return obj;
};

export default ExpandRouter;
