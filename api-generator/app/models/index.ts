import { Model, ModelCtor, Sequelize } from "sequelize";
import DataGroup from "./DataGroup";
import DataStructure from "./DataStructure";
import DataList from "./DataList";
import DataRow from "./DataRow";
import Project from "./Project";
import Logic from "./Logic";
import LogicDetail from "./LogicDetail";

export interface IModel extends ModelCtor<Model<any, any>> {
  associate?: (model: typeof models) => IModel;
}

const env = process.env as any;

export const Db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  dialect:
    "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

const models = {
  dataGroup: DataGroup(Db),
  dataStructure: DataStructure(Db),
  dataRow: DataRow(Db),
  dataList: DataList(Db),
  project: Project(Db),
  logic: Logic(Db),
  logicDetail: LogicDetail(Db),
};

Object.keys(models).forEach((modelName) => {
  models[modelName as keyof typeof models].associate?.(models);
});

export default models;
