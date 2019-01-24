export const leagueInfo = scid => {
  const ocb = process.env.REACT_APP_ISA_OCB || '7ddb8793-e408-4da4-a3d0-09ce59b61d2d';
  const api = `https://bts-api-a.bpsgameserver.com/isa/v2/901/en/event`;
  const params = `?ocb=${ocb}&subCategoryIds=${scid}&EventMarketCount=1`;
  return fetch(`${api}${params}`)
}
