export const leagueInfo = scid => {
  const ocb = process.env.REACT_APP_ISA_OCB;
  const api = `https://bts-api-a.bpsgameserver.com/isa/v2/901/en/event`;
  const params = `?ocb=${ocb}&subCategoryIds=${scid}&EventMarketCount=1`;
  return fetch(`${api}${params}`)
}
