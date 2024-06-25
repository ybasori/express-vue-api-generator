import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

const DataGroup = (sequelize: Sequelize) => {
  const dataGroup: IModel = sequelize.define(
    "data_group",
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
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

  dataGroup.associate = (model) => {
    dataGroup.hasMany(model.dataStructure, {
      as: "dataStructure",
      foreignKey: { name: "dataGroupId" },
    });
    dataGroup.hasMany(model.dataRow, {
      as: "dataRow",
      foreignKey: { name: "dataGroupId" },
    });
    dataGroup.hasMany(model.dataList, {
      as: "dataList",
      foreignKey: { name: "dataGroupId" },
    });

    return dataGroup;
  };

  return dataGroup;
};

export default DataGroup;
