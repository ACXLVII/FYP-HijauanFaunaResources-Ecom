/**
 * Converts a measurement string (e.g., '2ft x 1ft', '24in x 12in') to area in square feet.
 * @param {string} measurement - The measurement string.
 * @returns {number} Area in square feet.
 */
export function parseMeasurementToSqFt(measurement) {
  if (!measurement) return 0;
  const match = measurement.match(/([\d.]+)\s*ft\s*[xX×]\s*([\d.]+)\s*ft/i);
  if (match) {
    return parseFloat(match[1]) * parseFloat(match[2]);
  }
  const matchIn = measurement.match(/([\d.]+)\s*in\s*[xX×]\s*([\d.]+)\s*in/i);
  if (matchIn) {
    return (parseFloat(matchIn[1]) * parseFloat(matchIn[2])) / 144;
  }
  return 0;
} 