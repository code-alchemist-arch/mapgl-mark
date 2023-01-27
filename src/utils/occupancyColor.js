export default function (relativeOccupancy, tagName) {
  let occupancyColor = '#5ba900';
  if (relativeOccupancy >= 100) {
    occupancyColor = '#db3348';
  } else if (relativeOccupancy >= 85) {
    occupancyColor = '#fab525';
  }

  if (!tagName) {
    return occupancyColor;
  }
  return `${tagName}-[${occupancyColor}]`;
}
