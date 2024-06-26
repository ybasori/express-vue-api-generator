import AnyController from "app/controllers/AnyController";
import { IRoute } from "app/helpers/ExpandRouter";
import DataGroupController from "./controllers/api/v1/DataGroupController";
import bodyParser from "body-parser";
import StructureController from "./controllers/api/v1/StructureController";
import DataListController from "./controllers/api/v1/DataListController";
import ProjectController from "./controllers/api/v1/ProjectController";

const Routes: () => IRoute[] = () => {
  return [
    {
      path: "/",
      children: [
        {
          path: "/api",
          children: [
            {
              path: "/v1",
              children: [
                {
                  path: "/project",
                  children: [
                    {
                      path: "/",
                      method: "get",
                      controller: ProjectController.index,
                    },
                    {
                      path: "/",
                      method: "post",
                      middleware: [bodyParser.json()],
                      controller: ProjectController.create,
                    },
                    {
                      path: "/:projectUuid",
                      children: [
                        {
                          path: "/",
                          method: "get",
                          controller: ProjectController.show,
                        },
                        {
                          path: "/",
                          method: "put",
                          middleware: [bodyParser.json()],
                          controller: ProjectController.update,
                        },
                        {
                          path: "/",
                          method: "delete",
                          controller: ProjectController.delete,
                        },
                        {
                          path: "/data-group",
                          children: [
                            {
                              path: "/",
                              method: "get",
                              controller: DataGroupController.index,
                            },
                            {
                              path: "/",
                              method: "post",
                              middleware: [bodyParser.json()],
                              controller: DataGroupController.create,
                            },
                            {
                              path: "/:dataGroupUuid",
                              children: [
                                {
                                  path: "/",
                                  method: "get",
                                  controller: DataGroupController.show,
                                },
                                {
                                  path: "/",
                                  method: "put",
                                  middleware: [bodyParser.json()],
                                  controller: DataGroupController.update,
                                },
                                {
                                  path: "/",
                                  method: "delete",
                                  controller: DataGroupController.delete,
                                },
                                {
                                  path: "/structure",
                                  children: [
                                    {
                                      path: "/",
                                      method: "get",
                                      controller: StructureController.index,
                                    },
                                    {
                                      path: "/",
                                      method: "post",
                                      middleware: [bodyParser.json()],
                                      controller: StructureController.create,
                                    },
                                    {
                                      path: "/:dataStructureUuid",
                                      method: "get",
                                      controller: StructureController.show,
                                    },
                                    {
                                      path: "/:dataStructureUuid",
                                      method: "put",
                                      middleware: [bodyParser.json()],
                                      controller: StructureController.update,
                                    },
                                    {
                                      path: "/:dataStructureUuid",
                                      method: "delete",
                                      controller: StructureController.delete,
                                    },
                                  ],
                                },
                                {
                                  path: "/list",
                                  children: [
                                    {
                                      path: "/",
                                      method: "get",
                                      controller: DataListController.index,
                                    },
                                    {
                                      path: "/",
                                      method: "post",
                                      middleware: [bodyParser.json()],
                                      controller: DataListController.create,
                                    },
                                    {
                                      path: "/:dataListUuid",
                                      method: "put",
                                      middleware: [bodyParser.json()],
                                      controller: DataListController.update,
                                    },
                                    {
                                      path: "/:dataListUuid",
                                      method: "delete",
                                      controller: DataListController.delete,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/*",
      method: "get",
      controller: AnyController,
    },
  ];
};

export default Routes;
