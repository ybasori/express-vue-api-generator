import type { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

export default (sequelize: Sequelize) => {
  const dataList: IModel = sequelize.define(
    "data_list",
    {
      uuid: DataTypes.STRING,
      dataGroupId: {
        type: DataTypes.INTEGER,
        field: "data_group_id",
      },
      dataStructureId: {
        type: DataTypes.INTEGER,
        field: "data_structure_id",
      },
      dataRowId: {
        type: DataTypes.INTEGER,
        field: "data_row_id",
      },
      dataValue: {
        type: DataTypes.TEXT,
        field: "data_value",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {}
  );
  dataList.associate = (model) => {
    dataList.belongsTo(model.dataStructure, {
      as: "dataStructure",
      foreignKey: { name: "dataStructureId" },
    });
    dataList.belongsTo(model.dataGroup, {
      as: "dataGroup",
      foreignKey: { name: "dataGroupId" },
    });
    return dataList;
  };
  return dataList;
};
