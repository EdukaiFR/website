export function getDaysLeft(date: Date | string) {
  const today = new Date();
  const targetDate = new Date(date);
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function formatDate(dateString: string): string {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const [day, month, year] = dateString.split("/").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
