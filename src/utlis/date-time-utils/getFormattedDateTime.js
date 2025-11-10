export default function getFormattedDateTime(date = new Date()) {
  // Ensure it's a valid Date object
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date)) {
    console.warn("Invalid date passed to getFormattedDateTime:", date);
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  const formattedDate = `${year}-${month}-${day}`;

  return `${formattedDate} ${formattedTime}`;
}