import React, { useEffect } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useDispatch, useSelector } from 'react-redux';

import DataContext from '@/contexts';
import getBrowserLanguage from '@/utils/i18n.js';
import useMediaQuery from '@/utils/useMediaQuery';
import useTenant from '@/hooks/useTenant.js';
import useTranslations from '@/hooks/useTranslations.js';
import LocationsSidebar from '@/components/LocationsSidebar';
import LocationsMap from '@/components/LocationsMap';
import ViewSelection from '@/components/ViewSelection';
import FullScreenLoader from '@/components/FullScreenLoader';

import { changeIsMobile } from './homeSlice';
import classNames from 'classnames';

function Home() {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const hasSelectedLocation = useSelector(
    (state) => !!state?.home?.selectedLocation?.id,
  );

  const [tenant, tenantStatus] = useTenant();
  const [translations, translationsStatus] = useTranslations();

  const locationsCol = collection(firestore, 'locations');
  const locationsQuery = query(
    locationsCol,
    where('tenantId', '==', tenant?.id || 'N/A'),
  );

  const { status: statusLocations, data: locations } =
    useFirestoreCollectionData(locationsQuery, {
      idField: 'id',
    });

  const isDetailBottomSheetOpen = useSelector(
    (state) => state.home.isDetailBottomSheetOpen,
  );

  const matchIsMobile = useMediaQuery(
    '(max-width: 575px), (max-height: 575px)',
  );
  useEffect(() => {
    dispatch(changeIsMobile(matchIsMobile));
  }, [matchIsMobile]);

  if (
    statusLocations === 'loading' ||
    tenantStatus === 'loading' ||
    translationsStatus === 'loading'
  ) {
    return (
      <FullScreenLoader
        backgroundColor={tenant?.branding?.headerBackgroundColor}
      />
    );
  }

  const mainClasses = classNames('h-screen flex font-default', {
    'opacity-0': matchIsMobile && hasSelectedLocation,
  });

  return (
    <DataContext.Provider
      value={{
        ...tenant,
        translations,
        language: getBrowserLanguage(),
      }}
    >
      <div id="home-container" className={mainClasses}>
        <LocationsSidebar tenant={tenant} locations={locations || []} />
        <LocationsMap tenant={tenant} locations={locations || []} />
        {!isDetailBottomSheetOpen && <ViewSelection />}
      </div>
    </DataContext.Provider>
  );
}

export default Home;
