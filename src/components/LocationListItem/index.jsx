import { useContext, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import DataContext from '../../contexts';
import { openLocation } from '../../features/home/homeSlice';

function LocationItem({ location }) {
  const {
    id,
    spaceId,
    title,
    relativeOccupancy,
    location: address,
  } = location || {};

  const dispatch = useDispatch();
  const selectedLocation = useSelector((state) => state.home.selectedLocation);
  const dataContext = useContext(DataContext);

  const isFullOccupancy = useMemo(
    () => location?.relativeOccupancy >= 100,
    [location],
  );

  const isSelected = useMemo(
    () => location?.id === selectedLocation?.id,
    [location, selectedLocation],
  );

  const occupancyColor = useMemo(() => {
    const { relativeOccupancy } = location;
    if (relativeOccupancy >= 100) {
      return 'text-occupancy-full';
    } else if (relativeOccupancy >= 85) {
      return 'text-occupancy-medium';
    }
    return 'text-occupancy-low';
  }, [location]);

  return (
    <a
      key={id}
      href={`#${spaceId}`}
      className={classNames(
        'w-full h-min flex items-center px-6 pt-4 pb-3 text-sm rounded-md bg-white shadow-md text-gray-900 border',
        { 'border-[#D9D9D9] opacity-30': isFullOccupancy },
        {
          'bg-[#F2F9FF] shadow-md border border-[#6BB8FF] rounded-lg':
            isSelected,
        },
      )}
      onClick={() => dispatch(openLocation(location))}
    >
      <div className="w-full flex items-center space-x-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-black font-inter md:text-xl">
            {title}
          </p>
          <p className="truncate text-sm font-normal text-black">
            {address?.city}
          </p>
        </div>
        <div>
          <p
            className={classNames(
              'text-base text-center font-bold md:text-xl',
              occupancyColor,
            )}
          >{`${relativeOccupancy}%`}</p>
          <p
            className={classNames(
              'truncate text-sm font-normal',
              occupancyColor,
            )}
          >
            {dataContext?.translations?.['occupied']}
          </p>
        </div>
      </div>
    </a>
  );
}

export default LocationItem;
