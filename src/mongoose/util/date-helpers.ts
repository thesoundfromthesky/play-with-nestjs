export function get2digits(num: number): string {
  return `0${num}`.slice(-2);
}

export function getDate(dateObj: Date): string | void {
  if (dateObj instanceof Date) {
    return (
      `${dateObj.getFullYear()}-` +
      `${get2digits(dateObj.getMonth() + 1)}-` +
      `${get2digits(dateObj.getDate())}`
    );
  }
}

export function getTime(dateObj: Date): string | void {
  if (dateObj instanceof Date) {
    return (
      `${get2digits(dateObj.getHours())}:` +
      `${get2digits(dateObj.getMinutes())}:` +
      `${get2digits(dateObj.getSeconds())}`
    );
  }
}
