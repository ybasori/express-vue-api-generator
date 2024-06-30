import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

const Logic = (sequelize: Sequelize) => {
  const logic: IModel = sequelize.define(
    "logics",
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      projectId: {
        type: DataTypes.INTEGER,
        field: "project_id",
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

  logic.associate = (model) => {
    logic.belongsTo(model.project, {
      as: "project",
      foreignKey: { name: "projectId" },
    });
    logic.hasMany(model.logicDetail, {
      as: "logicDetail",
      foreignKey: { name: "logicId" },
    });

    return logic;
  };

  return logic;
};

export default Logic;
