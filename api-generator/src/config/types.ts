export interface IDataGroup {
  name: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDataStructure {
  name: string;
  uuid: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDataRow {
  uuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDataList {
  uuid: string;
  dataValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDataListWithStructure extends IDataList {
  dataStructure: IDataStructure;
}

export interface IDataRowWithListStructure extends IDataRow {
  dataList: IDataListWithStructure[];
}
