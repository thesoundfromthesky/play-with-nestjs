// antarctica_ice_sheets_남극
export function getRegExpForAntarctica() {
  const year = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const mass = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const nonCap = /(?:[-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const space = /\s*/.source;
  const length = 3;
  let str = "^";
  for (let i = 0; i < length; ++i) {
    switch (i) {
      case 0:
        str += year;
        break;
      case 2:
        str += mass;
        break;
      default:
        str += nonCap;
        break;
    }
    if (i < length - 1) {
      str += space;
    }
  }
  str += "$";
  return new RegExp(str, "gm");
}

export const getCleanForAntarctica = /^HDR.*$(?:\r\n?|\n)/gm;
export const getReplaceForAntarctica = `{"year":$1, "mass":$2},`;
export const getWrapperForAntarctica = `{"antarctica":[\n$1`;
