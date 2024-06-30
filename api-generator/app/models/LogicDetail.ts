import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

const LogicDetail = (sequelize: Sequelize) => {
  const logicDetail: IModel = sequelize.define(
    "logic_details",
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      logicId: {
        type: DataTypes.INTEGER,
        field: "logic_id",
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

  logicDetail.associate = (model) => {
    logicDetail.belongsTo(model.logic, {
      as: "logic",
      foreignKey: { name: "logicId" },
    });

    return logicDetail;
  };

  return logicDetail;
};

export default LogicDetail;
