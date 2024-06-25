import type { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import models, { IModel } from ".";

const DataStructure = (sequelize: Sequelize) => {
  const dataStructure: IModel = sequelize.define(
    "data_structure",
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        field: "data_type",
      },
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

  dataStructure.associate = (model) => {
    dataStructure.belongsTo(model.dataGroup, {
      as: "dataGroup",
      foreignKey: { name: "dataGroupId" },
    });
    dataStructure.hasMany(model.dataList, {
      as: "dataList",
      foreignKey: { name: "dataStructureId" },
    });

    return dataStructure;
  };

  return dataStructure;
};
export default DataStructure;
