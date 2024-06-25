import express from "express";

// import { v4 } from "uuid";
import ExpandRouter from "app/helpers/ExpandRouter";
import Routes from "app/Routes";

const app = express();

// app.use(express.static("./public"));

ExpandRouter(Routes()).forEach((item) =>
  item.controller && item.method
    ? app[item.method](
        item.path,
        item.middleware ? item.middleware : [],
        item.controller
      )
    : null
);

export default app;
