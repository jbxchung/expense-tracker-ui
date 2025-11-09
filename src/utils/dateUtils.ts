// merge two date ranges
export function mergeDateRange(
  a?: { minDate?: Date; maxDate?: Date },
  b?: { minDate?: Date; maxDate?: Date }
): { minDate?: Date; maxDate?: Date } {
  // Determine earliest start date (smallest)
  let minDate: Date | undefined;
  if (a?.minDate && b?.minDate) {
    minDate = a.minDate < b.minDate ? a.minDate : b.minDate;
  } else {
    minDate = a?.minDate ?? b?.minDate;
  }

  // Determine latest end date (largest)
  let maxDate: Date | undefined;
  if (a?.maxDate && b?.maxDate) {
    maxDate = a.maxDate > b.maxDate ? a.maxDate : b.maxDate;
  } else {
    maxDate = a?.maxDate ?? b?.maxDate;
  }

  return { minDate, maxDate };
}