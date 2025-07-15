function validateLiveClassFields(body) {
  const {
    course,
    description,
    days,
    time,
    duration,
    seats,
    price,
    location,
    level,
  } = body;
  let daysArr = days;
  if (typeof daysArr === "string") daysArr = [daysArr];
  if (
    !course ||
    !description ||
    !daysArr ||
    !Array.isArray(daysArr) ||
    daysArr.length === 0 ||
    !time ||
    !duration ||
    !seats ||
    !price ||
    !location ||
    !level
  ) {
    return {
      valid: false,
      error: "All fields are required! (days must be a non-empty array)",
    };
  }
  return { valid: true, days: daysArr };
}
module.exports = validateLiveClassFields;
