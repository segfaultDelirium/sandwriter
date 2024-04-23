export function ISOdateStringToLocaleDate(isoDateString: string) {
  const utcDate = new Date(`${isoDateString}Z`);
  const localTime = new Date(utcDate.getTime());
  return new Date(localTime).toLocaleString('sv');
}
