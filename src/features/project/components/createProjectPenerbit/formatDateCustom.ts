function formatDateToCustom(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0

  return `${year}-${day}-${month}`;
}
