import type { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

export default (sequelize: Sequelize) => {
  const dataRow: IModel = sequelize.define(
    "data_rows",
    {
      uuid: DataTypes.STRING,
      // name: DataTypes.STRING,
      dataGroupId: {
        type: DataTypes.INTEGER,
        field: "data_group_id",
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

  dataRow.associate = (model) => {
    dataRow.belongsTo(model.dataGroup, {
      as: "dataGroup",
      foreignKey: { name: "dataGroupId" },
    });
    dataRow.hasMany(model.dataList, {
      as: "dataList",
      foreignKey: { name: "dataRowId" },
    });
    return dataRow;
  };
  return dataRow;
};
