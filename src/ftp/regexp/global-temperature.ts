// global_temperature
export function getRegExpForGlobalTemperature() {
  const year = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
  const temp = /([-+]?[0-9]+(?:\.[0-9]+)?)/.source;
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
        str += temp;
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

export const getCleanForGlobalTemperature = /^([a-zA-Z].*|-*)$(?:\r\n?|\n)/gm;
export const getReplaceForGlobalTemperature = `{"year":$1, "temp":$2},`;
export const getWrapperForGlobalTemperature = `{"global_temp":[\n$1`;
