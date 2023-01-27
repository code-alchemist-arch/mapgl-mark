import React, { useMemo, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';

import { ReactComponent as IconMarker } from '../../assets/images/marker.svg';
import { ReactComponent as IconMarkerSelected } from '../../assets/images/marker-selected.svg';
import { closeLocation, openLocation } from '@/features/home/homeSlice.js';

import Header from '../Header';
import DetailPopup from '../DetailPopup';
import DetailModal from '../DetailModal';
import DetailBottomSheet from '../DetailBottomSheet';

import './index.pcss';

function calculateCenterOfLocations(locations) {
  let latitude = 0,
    longitude = 0;

  locations.forEach((locationItr) => {
    longitude += locationItr.location.geopoint.long;
    latitude += locationItr.location.geopoint.lat;
  });

  latitude = latitude / locations.length;
  longitude = longitude / locations.length;

  return {
    lat: latitude,
    long: longitude,
  };
}

function LocationsMap({ locations }) {
  const dispatch = useDispatch();
  const { selectedLocation, isMobile } = useSelector((state) => state.home);
  const isListView = useSelector((state) => state.home.view === 'list');

  const mapRef = useRef();
  useEffect(() => {
    mapRef?.current?.resize();
  }, [isListView, mapRef]);

  const parsedLocations = useMemo(() => {
    const editedLocations = [...locations];
    editedLocations.forEach((locationItr) => {
      const locationSameCoordinates = locations?.filter(
        (searchItr) =>
          searchItr.location.geopoint.long ===
            locationItr.location.geopoint.long &&
          searchItr.location.geopoint.lat === locationItr.location.geopoint.lat,
      );
      if (locationSameCoordinates?.length <= 1) {
        return;
      }

      locationSameCoordinates.forEach((sameItr, sameIdx) => {
        const editedLocationIdx = editedLocations.findIndex(
          (editedItr) => editedItr.id === sameItr.id,
        );
        editedLocations[editedLocationIdx].location.geopoint.long =
          sameItr.location.geopoint.long + sameIdx * 0.0001;
      });
    });
    return editedLocations;
  }, [locations]);

  const locationMarkers = useMemo(
    () =>
      parsedLocations?.map((locationItr, index) => {
        const isSelected = selectedLocation?.id === locationItr.id;
        let markerClass = 'yc-map__marker--occupancy-low';
        if (locationItr?.relativeOccupancy >= 100) {
          markerClass = 'yc-map__marker--occupancy-full';
        } else if (locationItr?.relativeOccupancy >= 85) {
          markerClass = 'yc-map__marker--occupancy-medium';
        }

        return (
          <Marker
            key={`marker-${index}`}
            longitude={locationItr.location.geopoint.long}
            latitude={locationItr.location.geopoint.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              dispatch(openLocation(locationItr, 'marker'));
            }}
          >
            {!isSelected && (
              <div className={`yc-map__marker ${markerClass}`}>
                <IconMarker />
              </div>
            )}
            {isSelected && <IconMarkerSelected />}
          </Marker>
        );
      }),
    [dispatch, selectedLocation, parsedLocations],
  );

  const [viewState, setViewState] = useState({
    latitude: 46.9502655,
    longitude: 7.4410446,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  // make sure all the markers are visible on the map
  const [hasCenteredMap, setHasCenteredMap] = useState(false);
  useEffect(() => {
    if (!mapRef.current) return;
    if (hasCenteredMap) return;

    try {
      const latitudes = parsedLocations?.map(
        (locationItr) => locationItr.location.geopoint.lat,
      );
      const longitudes = parsedLocations?.map(
        (locationItr) => locationItr.location.geopoint.long,
      );

      const maxLat = Math.max(...latitudes);
      const minLat = Math.min(...latitudes);
      const maxLng = Math.max(...longitudes);
      const minLng = Math.min(...longitudes);

      const southWest = [minLng, minLat];
      const northEast = [maxLng, maxLat];

      const map = mapRef.current?.getMap();
      map?.fitBounds([southWest, northEast], {
        padding: 100,
      });
    } catch (err) {
      const centerOfLocations = calculateCenterOfLocations(parsedLocations);
      setViewState((prevState) => ({
        ...prevState,
        latitude: centerOfLocations.lat,
        longitude: centerOfLocations.long,
        zoom: 8,
      }));
    }

    setHasCenteredMap(true);
  }, [
    setViewState,
    setHasCenteredMap,
    hasCenteredMap,
    mapRef.current,
    parsedLocations,
  ]);

  useEffect(() => {
    if (!selectedLocation) return;

    setViewState({
      ...viewState,
      latitude: selectedLocation.location.geopoint.lat,
      longitude: selectedLocation.location.geopoint.long,
    });
  }, [selectedLocation]);

  return (
    <div
      className={classNames(
        isListView ? 'hidden lg:block lg:w-full' : 'block w-full',
      )}
    >
      <div className="md:hidden">
        <Header />
      </div>
      <div className="relative">
        <div
          className={classNames(
            'yc-map__container w-full',
            isMobile ? 'h-[calc(100vh-77px)]' : 'h-screen',
          )}
        >
          <Map
            ref={mapRef}
            reuseMaps
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            dragPan
          >
            {!isMobile && <NavigationControl position="bottom-right" />}
            {locationMarkers}
            {!isMobile && selectedLocation && (
              <Popup
                anchor="left"
                longitude={Number(selectedLocation.location.geopoint.long)}
                latitude={Number(selectedLocation.location.geopoint.lat)}
                closeButton={false}
                className="yc-map__popup"
                onClose={() => dispatch(closeLocation())}
              >
                <DetailPopup onClose={() => dispatch(closeLocation())} />
              </Popup>
            )}
            {isMobile && <DetailBottomSheet />}
          </Map>
        </div>
      </div>
      {isMobile && selectedLocation && <DetailModal />}
    </div>
  );
}

export default LocationsMap;
