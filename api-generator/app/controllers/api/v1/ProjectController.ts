import Validator, { IRules } from "app/helpers/Validator";
import models from "app/models";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";

interface IProjectController {
  index: RequestHandler;
  show: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

//

const ProjectController: IProjectController = {
  index: async (req, res) => {
    let unitData = await models.project.findAndCountAll({
      ...(req.query.sort
        ? {
            order: (
              [...(req.query.sort as { key: string; order: string }[])] ?? []
            ).map((item) => [item.key, item.order]),
          }
        : {}),
      ...(req.query.page
        ? { offset: (Number(req.query.page) - 1) * Number(req.query.limit) }
        : {}),
      ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
    });
    return res.status(200).json({
      status: "ok",
      msg: "Hello",
      data: unitData,
    });
  },
  show: async (req, res) => {
    let unitData = await models.project.findOne({
      where: {
        uuid: req.params.projectUuid,
      },
    });
    return res.status(200).json({
      status: "ok",
      msg: "Hello",
      data: unitData,
    });
  },
  create: async (req, res) => {
    try {
      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            unique: "project,name",
          },
        },
      };

      const validate = await Validator.make(req.body, rules);
      if (validate.fails()) {
        return res.status(400).json({
          status: "error",
          msg: "Something went wrong!",
          error: validate.getMessages(),
        });
      }

      let result = await models.project.create({
        ...req.body,
        uuid: uuidv4(),
      });
      return res.status(200).json({
        status: "ok",
        msg: "Hello",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong!",
        data: null,
        error: err,
      });
    }
  },
  update: async (req, res) => {
    try {
      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            unique: `project,name,${req.params.projectUuid},uuid`,
          },
        },
      };

      const validate = await Validator.make(req.body, rules);
      if (validate.fails()) {
        return res.status(400).json({
          status: "error",
          msg: "Something went wrong!",
          error: validate.getMessages(),
        });
      }

      let result = await models.project.update(
        {
          ...req.body,
        },
        {
          where: {
            uuid: req.params.projectUuid,
          },
        }
      );
      return res.status(200).json({
        status: "ok",
        msg: "Hello",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong!",
        data: null,
        error: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      let result = await models.project.destroy({
        where: {
          uuid: req.params.projectUuid,
        },
      });
      return res.status(200).json({
        status: "ok",
        msg: "Hello",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong!",
        data: null,
        error: err,
      });
    }
  },
};

export default ProjectController;
