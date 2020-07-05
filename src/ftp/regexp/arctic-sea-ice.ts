// arctic_sea_ice_minimum_북극
export function getRegExpForArctic() {
  const year = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const extent = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const nonCap = /(?:[-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const nonCapLetters = /(?:[a-zA-Z]+(?:[-_]?[a-zA-Z]*)?)/.source;
  const space = /\s*/.source;

  const length = 6;
  let str = "^";
  for (let i = 0; i < length; ++i) {
    switch (i) {
      case 0:
        str += year;
        break;
      case 2:
        str += nonCapLetters;
        break;
      case 3:
        str += nonCapLetters;
        break;
      case 4:
        str += extent;
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

export const getCleanForArctic: RegExp = /^year.*$(?:\r\n?|\n)/gm;
export const getReplaceForArctic: string = `{"year":$1, "extent":$2},`;
export const getWrapperForArctic: string = `{"arctic":[\n$1`;
