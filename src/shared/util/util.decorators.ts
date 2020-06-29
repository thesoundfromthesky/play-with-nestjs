export function AsyncTryCatch(
  target,
  name: string,
  descriptor: PropertyDescriptor
) {
  // const original = descriptor.value;
  // if (typeof original === "function") {
  //   descriptor.value = async function(...args) {
  //     try {
  //       const result = await original.apply(this, args);
  //       return result;
  //     } catch (err) {
  //       throw err;
  //     }
  //   };
  // }
  // return descriptor;
}
