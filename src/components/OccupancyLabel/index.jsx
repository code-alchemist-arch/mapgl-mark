import { useContext } from 'react';
import classNames from 'classnames';

import DataContext from '@/contexts.js';
import occupancyColor from '@/utils/occupancyColor.js';
import { getTranslation } from '@/utils/i18n.js';

function OccupancyLabel({ location }) {
  const { relativeOccupancy } = location || {};
  const dataContext = useContext(DataContext);

  return (
    <p
      style={{ color: occupancyColor(relativeOccupancy) }}
      className={classNames('text-2xl font-bold md:hidden', {
        'text-xl': relativeOccupancy >= 100,
      })}
    >
      {getTranslation(
        dataContext.translations,
        'occupancy-label',
        relativeOccupancy || 0,
      )}
    </p>
  );
}

export default OccupancyLabel;
