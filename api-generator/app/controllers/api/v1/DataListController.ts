import models, { Db } from "app/models";
import { RequestHandler } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface IDataListController {
  index: RequestHandler;
  create: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}

const DataListController: IDataListController = {
  index: async (req, res) => {
    try {
      let dataGroup = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
        include: {
          model: models.dataStructure,
          as: "dataStructure",
        },
      });

      let offset = "";
      let limit = "";
      let sort = "";

      if (!!req.query.page) {
        offset = `${(Number(req.query.page) - 1) * Number(req.query.limit)}, `;
      }

      if (!!req.query.limit) {
        limit = `LIMIT ${offset}${req.query.limit}`;
      }

      if (!!req.query.sort) {
        sort = `ORDER BY ${[
          ...(req.query.sort as unknown as { key: string; order: string }[]),
        ]
          .map((item) => `\`data_main\`.\`${item.key}\` ${item.order}`)
          .join(", ")}`;
      }

      const columns = [...dataGroup?.dataValues.dataStructure]
        .map(
          (item) =>
            `(SELECT \`data_lists\`.\`data_value\` FROM \`data_lists\` WHERE \`data_lists\`.\`data_structure_id\` = "${item.id}" and \`data_lists\`.\`data_row_id\` = \`data_rows\`.\`id\`) AS "${item.name}"`
        )
        .join(", ");

      const sql = `SELECT uuid, ${
        columns === "" ? "" : columns + ","
      } created_at as createdAt, updated_at as updatedAt FROM \`data_rows\` WHERE \`data_rows\`.\`data_group_id\` ="${
        dataGroup?.dataValues.id
      }"`;

      const [rows] = await Db.query(
        `SELECT * FROM (${sql}) \`data_main\` ${sort} ${limit} `,
        {
          raw: true,
        }
      );
      // @ts-expect-error
      const [[{ count }]] = await Db.query(
        `SELECT COUNT(*) as count FROM (${sql}) \`data_main\``,
        {
          raw: true,
        }
      );

      return res.status(200).json({
        status: "ok",
        msg: "Hello",
        data: {
          dataGroup,
          dataRow: {
            rows,
            count,
          },
        },
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
      let dataGroup = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
        include: {
          model: models.dataStructure,
          as: "dataStructure",
        },
      });

      let dataRow = await models.dataRow.create({
        dataGroupId: dataGroup?.dataValues.id,
        uuid: uuidv4(),
      });

      const result = await Promise.all(
        Object.keys(req.body).map(async (key) => {
          let [dataStructure] = [...dataGroup?.dataValues.dataStructure].filter(
            (item) => item.name === key
          );

          if (dataStructure) {
            let dataList = await models.dataList.create({
              dataGroupId: dataGroup?.dataValues.id,
              dataRowId: dataRow?.dataValues.id,
              dataStructureId: dataStructure.id,
              uuid: uuidv4(),
              dataValue: req.body[key],
            });
            return dataList?.dataValues;
          }

          return null;
        })
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
  update: async (req, res) => {
    try {
      let dataGroup = await models.dataGroup.findOne({
        where: {
          uuid: req.params.dataGroupUuid,
        },
        include: {
          model: models.dataStructure,
          as: "dataStructure",
        },
      });

      let dataRow = await models.dataRow.findOne({
        where: {
          uuid: req.params.dataListUuid,
        },
      });

      const result = await Promise.all(
        Object.keys(req.body).map(async (key) => {
          let [dataStructure] = [...dataGroup?.dataValues.dataStructure].filter(
            (item) => item.name === key
          );

          if (dataStructure) {
            let dataList = await models.dataList.update(
              {
                dataValue: req.body[key],
              },
              {
                where: {
                  dataGroupId: dataGroup?.dataValues.id,
                  dataRowId: dataRow?.dataValues.id,
                  dataStructureId: dataStructure.id,
                },
              }
            );
            return dataList;
          }

          return null;
        })
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
      let result = await models.dataRow.destroy({
        where: {
          uuid: req.params.dataListUuid,
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

export default DataListController;
