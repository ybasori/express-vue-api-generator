import Validator, { IRules } from "app/helpers/Validator";
import models from "app/models";
import { RequestHandler } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface IStructureController {
  index: RequestHandler;
  show: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

//

const StructureController: IStructureController = {
  index: async (req, res) => {
    try {
      let dataGroup = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
      });
      let unitData = await models.dataStructure.findAndCountAll({
        where: {
          dataGroupId: dataGroup?.dataValues.id,
        },
        include: {
          model: models.dataGroup,
          as: "dataGroup",
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
    } catch (err) {
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong!",
        data: null,
        error: err,
      });
    }
  },
  show: async (req, res) => {
    try {
      let unitData = await models.dataStructure.findOne({
        where: {
          uuid: req.params.dataStructureUuid,
        },
        include: {
          model: models.dataGroup,
          as: "dataGroup",
        },
      });
      return res.status(200).json({
        status: "ok",
        msg: "Hello",
        data: unitData,
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
  create: async (req, res) => {
    try {
      let unitData = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
      });

      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            custom: async ({ setMessage, value, label }) => {
              const dt = await models.dataStructure.findOne({
                where: {
                  name: value,
                  dataGroupId: unitData?.dataValues.id,
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
        type: {
          label: "type",
          rule: {
            required: true,
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

      let result = await models.dataStructure.create({
        ...req.body,
        dataGroupId: unitData?.dataValues.id,
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
      let unitData = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
      });

      const rules: IRules = {
        name: {
          label: "Name",
          rule: {
            required: true,
            custom: async ({ setMessage, value, label }) => {
              const dt = await models.dataStructure.findOne({
                where: {
                  name: value,
                  dataGroupId: unitData?.dataValues.id,
                  uuid: {
                    [Op.ne]: req.params.dataStructureUuid,
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
        type: {
          label: "Type",
          rule: {
            required: true,
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

      let result = await models.dataStructure.update(
        {
          ...req.body,
        },
        {
          where: {
            uuid: req.params.dataStructureUuid,
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
      let result = await models.dataStructure.destroy({
        where: {
          uuid: req.params.dataStructureUuid,
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

export default StructureController;
