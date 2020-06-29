import { Injectable } from "@nestjs/common";
import * as ftp from "ftp";
import * as fs from "fs";
import * as path from "path";
import { Transform } from "stream";
import * as replaceStream from "replacestream";
import {
  getRegExpForCO2,
  getReplaceForCO2,
  getCleanForCO2,
  getWrapperForCO2,
  getWrapperForGlobalTemperature,
  getCleanForGlobalTemperature,
  getRegExpForGlobalTemperature,
  getReplaceForGlobalTemperature,
  getCleanForArctic,
  getReplaceForArctic,
  getWrapperForArctic,
  getRegExpForArctic,
  getCleanForAntarctica,
  getRegExpForAntarctica,
  getReplaceForAntarctica,
  getWrapperForAntarctica,
  getCleanForSeaLevel,
  getRegExpForSeaLevel,
  getReplaceForSeaLevel,
  getWrapperForSeaLevel
} from "./regexp";

@Injectable()
export class FtpService {
  client: ftp;
  convertList = [
    {
      input: "arctic_sea_ice_minimum_북극.txt",
      output: "arctic_sea_ice_minimum_북극.json",
      regExp: getRegExpForArctic(),
      clean: getCleanForArctic,
      replace: getReplaceForArctic,
      wrapper: getWrapperForArctic
    },
    {
      input: "global_temperature.txt",
      output: "global_temperature.json",
      regExp: getRegExpForGlobalTemperature(),
      clean: getCleanForGlobalTemperature,
      replace: getReplaceForGlobalTemperature,
      wrapper: getWrapperForGlobalTemperature
    },
    {
      input: "ice_sheets_남극.txt",
      output: "ice_sheets_남극.json",
      regExp: getRegExpForAntarctica(),
      clean: getCleanForAntarctica,
      replace: getReplaceForAntarctica,
      wrapper: getWrapperForAntarctica
    },
    {
      input: "sea_level.txt",
      output: "sea_level.json",
      regExp: getRegExpForSeaLevel(),
      clean: getCleanForSeaLevel,
      replace: getReplaceForSeaLevel,
      wrapper: getWrapperForSeaLevel
    },
    {
      input: "co2_mm_mlo.txt",
      output: "co2_mm_mlo.json",
      regExp: getRegExpForCO2(),
      clean: getCleanForCO2,
      replace: getReplaceForCO2,
      wrapper: getWrapperForCO2
    }
  ];
  constructor() {
    // this.processTxtToJson(this.convertList[4]);
    // this.processTxtToJson(this.convertList[1]);
    // this.processTxtToJson(this.convertList[2]);
    // this.processTxtToJson(this.convertList[0]);
    // this.processTxtToJson(this.convertList[3]);
    // this.convertList.forEach(item => this.processTxtToJson(item));
  }

  processTxtToJson({
    input,
    output,
    regExp,
    replace,
    clean,
    wrapper
  }: {
    input: string;
    output: string;
    regExp: RegExp;
    replace: string;
    clean: RegExp;
    wrapper: string;
  }) {
    const dirPath = path.join(__dirname, "files");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const fileName = input;
    const filePath = path.join(dirPath, fileName);
    const fileSize = fs.statSync(filePath).size;
    const rs = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });
    rs.pipe(replaceStream(regExp, replace))
      .pipe(this.getTransform(rs, fileSize, clean, wrapper))
      .pipe(fs.createWriteStream(path.join(dirPath, output)));
  }

  getTransform(
    rs: fs.ReadStream,
    fileSize: number,
    clean: RegExp,
    wrapper: string
  ) {
    return new Transform({
      // readableObjectMode: true,
      // writableObjectMode: true,
      transform(chunk, encoding, callback) {
        const chunkSize = rs.readableHighWaterMark;
        const { bytesRead, readable } = rs;
        const isFirstChunk = bytesRead <= chunkSize;
        const isLastChunk = bytesRead === fileSize;
        if (readable) {
          if (isFirstChunk && isLastChunk) {
            callback(
              null,
              chunk
                .toString()
                .replace(clean, "")
                .replace(/,\s*$/, "")
                .replace(/(.*)/s, wrapper + "\n]}")
            );
          } else if (isFirstChunk) {
            callback(
              null,
              chunk
                .toString()
                .replace(clean, "")
                .replace(/(.*)/s, wrapper)
            );
          } else if (isLastChunk) {
            callback(
              null,
              chunk
                .toString()
                .replace(/,\s*$/, "")
                .replace(/(.*)/s, `$1\n]}`)
            );
          } else {
            callback(null, chunk);
          }
        }
      }
    });
  }

  // init() {
  // this.client = new ftp();
  // this.client.on("ready", () => {
  //   this.client.get("products/trends/co2/co2_mm_mlo.txt", (err, stream) => {
  //     if (err) throw err;
  //     stream.once("close", () => {
  //       this.client.end();
  //     });
  //     const dirPath = path.join(__dirname, "files");
  //     if (!fs.existsSync(dirPath)) {
  //       fs.mkdirSync(dirPath);
  //     }
  //     const fileName = "co2_mm_mlo.txt";
  //     const filePath = path.join(dirPath, fileName);
  //     stream
  //       .pipe(
  //         new Transform({
  //           // readableObjectMode: true,
  //           // writableObjectMode: true,
  //           transform(chunk, encoding, callback) {
  //             callback(
  //               null,
  //               chunk
  //                 .toString()
  //                 .replace(/^#.*$/gm, "")
  //                 .replace(/^\s*$(?:\r\n?|\n)/gm, "")
  //                 .replace(
  //                   /^(?<year>[-+]?[0-9]*\.?[0-9]*)\s*([-+]?[0-9]*\.?[0-9]*)\s*([-+]?[0-9]*\.?[0-9]*)\s*([-+]?[0-9]*\.?[0-9]*)\s*([-+]?[0-9]*\.?[0-9]*)\s*(?<trend>[-+]?[0-9]*\.?[0-9]*)\s*([-+]?[0-9]*\.?[0-9]*)/gm,
  //                   "{year:$<year>, trend:$<trend>},"
  //                 )
  //             );
  //           }
  //         })
  //       )
  //       .pipe(fs.createWriteStream(filePath));
  //   });
  // });
  // this.client.connect({ host: "aftp.cmdl.noaa.gov" });
  // }
}
