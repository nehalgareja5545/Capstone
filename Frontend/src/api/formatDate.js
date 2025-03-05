const formatDate = (isoString) => {
  const date = new Date(isoString);

  return date.toLocaleDateString("en-GB", {
    weekday: "long", // Monday
    day: "numeric", // 23
    month: "long", // September
    year: "numeric", // 2025
  });
};

export default formatDate;
