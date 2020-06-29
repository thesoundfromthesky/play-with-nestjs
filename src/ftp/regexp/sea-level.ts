
// sea_level
export function getRegExpForSeaLevel() {
  const year = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const seaLevel = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const nonCap = /(?:[-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const space = /\s*/.source;

  const length = 12;
  let str = `^${space}`;
  for (let i = 0; i < length; ++i) {
    switch (i) {
      case 2:
        str += year;
        break;
      case 11:
        str += seaLevel;
        break;
      default:
        str += nonCap;
        break;
    }
    // if (i < length - 1) {
    //   str += space;
    // }
    str += space;
  }
  str += "$";
  return new RegExp(str, "gm");
}

export const getCleanForSeaLevel = /^HDR.*$(?:\r\n?|\n)/gm;
export const getReplaceForSeaLevel = `{"year":$1, "sea_level":$2},\n`;
export const getWrapperForSeaLevel = `{"sea_levels":[\n$1`;
