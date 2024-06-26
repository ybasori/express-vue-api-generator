import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { IModel } from ".";

const Project = (sequelize: Sequelize) => {
  const project: IModel = sequelize.define(
    "project",
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

  project.associate = (model) => {
    project.hasMany(model.dataGroup, {
      as: "project",
      foreignKey: { name: "projectId" },
    });

    return project;
  };

  return project;
};

export default Project;
