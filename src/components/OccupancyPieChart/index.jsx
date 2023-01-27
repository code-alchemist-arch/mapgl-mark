import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import occupancyColor from '../../utils/occupancyColor.js';

function OccupancyPieChart({ location }) {
  const { relativeOccupancy } = location || {};

  const occupancyRawColor = occupancyColor(relativeOccupancy);

  return (
    <CircularProgressbar
      value={relativeOccupancy || 0}
      text={`${relativeOccupancy || 0}%`}
      styles={buildStyles({
        rotation: 0,
        strokeLinecap: 'butt',
        textSize: relativeOccupancy >= 100 ? '22px' : '24px',
        pathTransitionDuration: 0.5,
        pathColor: occupancyRawColor,
        textColor: occupancyRawColor,
        trailColor: '#EDEDED',
        backgroundColor: 'white',
      })}
      background
      backgroundPadding={6}
      strokeWidth={7}
    />
  );
}

export default OccupancyPieChart;
