export const SunSign = [
  { color: "#488BD3", name: "Aquarius" },
  { color: "#96C691", name: "Pisces" },
  { color: "#DB212C", name: "Aries" },
  { color: "#568E4F", name: "Taurus" },
  { color: "#E8CB03", name: "Gemini" },
  { color: "#B5B5B5", name: "Cancer" },
  { color: "#F16F00", name: "Leo" },
  { color: "#9B5E27", name: "Virgo" },
  { color: "#EA6EA0", name: "Libra" },
  { color: "#000000", name: "Scorpio" },
  { color: "#854CAE", name: "Sagittarius" },
  { color: "#707070", name: "Capricorn" },
];

export const findSign = (date: Date) => {
  const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
  //   const signs = [
  //     "Aquarius",
  //     "Pisces",
  //     "Aries",
  //     "Taurus",
  //     "Gemini",
  //     "Cancer",
  //     "Leo",
  //     "Virgo",
  //     "Libra",
  //     "Scorpio",
  //     "Sagittarius",
  //     "Capricorn",
  //   ];
  let month = date.getMonth();
  let day = date.getDate();
  if (month == 0 && day <= 20) {
    month = 11;
  } else if (day < days[month]) {
    month--;
  }
  return month;
};
