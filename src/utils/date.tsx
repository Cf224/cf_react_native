// simple helper to format date to yyyy-mm-dd for calendar usage
export function toYMD(d) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `${dt.getMonth() + 1}`.padStart(2, '0');
  const dd = `${dt.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
