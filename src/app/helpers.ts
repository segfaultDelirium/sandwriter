export function ISOdateStringToLocaleDate(isoDateString: string) {
  const utcDate = new Date(`${isoDateString}Z`);
  const localTime = new Date(utcDate.getTime());
  const res = new Date(localTime).toLocaleString('sv');
  return res;
}

export function getCurrentISODateString() {
  const res = new Date().toISOString().slice(0, -1); // removing 'Z' from the end of date
  return res;
}
