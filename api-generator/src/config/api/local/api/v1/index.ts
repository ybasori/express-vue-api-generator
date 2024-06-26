export default (url: string) => ({
  PROJECT_INDEX: `${url}/project`,
  PROJECT_DETAIL: `${url}/project/:projectUuid`,
  DATAGROUP_INDEX: `${url}/project/:projectUuid/data-group`,
  DATAGROUP_DETAIL: `${url}/project/:projectUuid/data-group/:dataGroupUuid`,
  DATASTRUCTURE_INDEX: `${url}/project/:projectUuid/data-group/:dataGroupUuid/structure`,
  DATASTRUCTURE_DETAIL: `${url}/project/:projectUuid/data-group/:dataGroupUuid/structure/:dataStructureUuid`,
  DATALIST_INDEX: `${url}/project/:projectUuid/data-group/:dataGroupUuid/list`,
  DATALIST_DETAIL: `${url}/project/:projectUuid/data-group/:dataGroupUuid/list/:dataListUuid`,
});
