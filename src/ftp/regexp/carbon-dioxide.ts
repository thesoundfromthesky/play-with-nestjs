// co2_mm_mlo
export function getRegExpForCO2() {
  const year = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const trend = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const nonCap = /(?:[-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const space = /\s*/.source;
  const length = 7;
  let str = "^";
  for (let i = 0; i < length; ++i) {
    switch (i) {
      case 0:
        str += year;
        break;
      case 5:
        str += trend;
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

export const getCleanForCO2 = /^#.*$(?:\r\n?|\n)/gm;
export const getReplaceForCO2 = `{"year":$1, "trend":$2},`;
export const getWrapperForCO2 = `{"co2":[\n$1`;
