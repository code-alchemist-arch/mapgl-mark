import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import Fuse from 'fuse.js';

import { selectIsListView } from '@/features/home/homeSlice.js';

import LocationList from '../LocationList';
import LocationSearch from '../LocationSearch';
import Header from '../Header';

function LocationsSidebar({ locations }) {
  const isListView = useSelector(selectIsListView);
  const isHidden = !isListView;

  const [isLowOccupancyVisible, setIsLowOccupancyVisible] = useState(false);
  const [searchQuery, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(locations, {
      keys: ['title', 'location.city'],
    });
  }, [locations]);

  const sortedLocations = useMemo(() => {
    return locations.sort((a, b) => a.order - b.order);
  }, [locations]);

  const locationSearchResults = useMemo(() => {
    if (!searchQuery) {
      return sortedLocations;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, sortedLocations, searchQuery]);

  const filteredLocations = useMemo(() => {
    if (!isLowOccupancyVisible) return locationSearchResults;

    return locationSearchResults?.filter(
      (location) => location.relativeOccupancy < 85,
    );
  }, [locationSearchResults, isLowOccupancyVisible]);

  return (
    <div
      className={classNames(
        'w-screen z-10 lg:inset-y-0 lg:flex lg:w-1/3 lg:flex-col lg:flex-shrink-0 lg:min-w-[330px]',
        isHidden ? 'hidden lg:block' : 'block',
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col lg:max-h-screen min-h-screen overflow-hidden">
          <Header />
          <LocationSearch
            isLowOccupancyVisible={isLowOccupancyVisible}
            searchQuery={searchQuery}
            setIsLowOccupancyVisible={setIsLowOccupancyVisible}
            setQuery={setQuery}
          />
          <LocationList locations={filteredLocations} />
        </div>
      </div>
    </div>
  );
}

export default LocationsSidebar;
