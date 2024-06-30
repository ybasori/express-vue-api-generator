import Validator, { IRules } from "app/helpers/Validator";
import models from "app/models";
import { RequestHandler } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface ILogicController {
  index: RequestHandler;
  show: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

//

const LogicDetailController: ILogicController = {
  index: async (req, res) => {
    let project = await models.logic.findOne({
      where: {
        uuid: req.params.logicUuid,
      },
    });
    let unitData = await models.logicDetail.findAndCountAll({
      where: {
        logicId: project?.dataValues.id,
      },
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
    let unitData = await models.logicDetail.findOne({
      where: {
        uuid: req.params.logicDetailUuid,
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
      let unitData = await models.logic.findOne({
        where: {
          uuid: req.params.logicUuid,
        },
      });
      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            custom: async ({ setMessage, value, label }) => {
              const dt = await models.logicDetail.findOne({
                where: {
                  name: value,
                  logicId: unitData?.dataValues.id,
                },
              });

              if (dt?.dataValues) {
                return setMessage(`${label} is already taken.`);
              } else {
                return true;
              }
            },
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

      let result = await models.logicDetail.create({
        ...req.body,
        logicId: unitData?.dataValues.id,
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
      let unitData = await models.logic.findOne({
        where: {
          uuid: req.params.logicUuid,
        },
      });
      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            custom: async ({ setMessage, value, label }) => {
              const dt = await models.logicDetail.findOne({
                where: {
                  name: value,
                  logicId: unitData?.dataValues.id,
                  uuid: {
                    [Op.ne]: req.params.logicUuid,
                  },
                },
              });

              if (dt?.dataValues) {
                return setMessage(`${label} is already taken.`);
              } else {
                return true;
              }
            },
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

      let result = await models.logicDetail.update(
        {
          ...req.body,
        },
        {
          where: {
            uuid: req.params.logicDetailUuid,
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
      let result = await models.logicDetail.destroy({
        where: {
          uuid: req.params.logicDetailUuid,
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

export default LogicDetailController;
