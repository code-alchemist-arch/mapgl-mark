import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sheet from 'react-modal-sheet';

import DataContext from '@/contexts.js';
import { getTranslation } from '@/utils/i18n.js';
import {
  changeIsDetailBottomSheetOpen,
  closeDetailLocation,
  openLocation,
} from '@/features/home/homeSlice.js';

import OccupancyPieChart from '../OccupancyPieChart/index.jsx';
import OccupancyLabel from '../OccupancyLabel/index.jsx';

export default function DetailPreviewPopup() {
  const dataContext = useContext(DataContext);

  const dispatch = useDispatch();
  const isDetailBottomSheetOpen = useSelector(
    (state) => state.home.isDetailBottomSheetOpen,
  );
  const detailLocation =
    useSelector((state) => state.home.detailLocation) || {};
  const { title, location } = detailLocation;

  return (
    <>
      <Sheet
        isOpen={isDetailBottomSheetOpen}
        onClose={() => dispatch(changeIsDetailBottomSheetOpen(false))}
        detent="content-height"
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="p-9 pt-2">
              <div className="flex align-center">
                <div>
                  <h2 className="text-2xl font-bold text-black leading-8 md:text-3xl">
                    {title || ''}
                  </h2>
                  <p className="text-xl">{location?.city || ''}</p>
                </div>
                <div
                  className="ml-4"
                  style={{
                    width: '90px',
                    minWidth: '90px',
                    height: '90px',
                    minHeight: '90px',
                  }}
                >
                  <OccupancyPieChart location={detailLocation} />
                </div>
              </div>
              <div className="py-6">
                <OccupancyLabel location={detailLocation} />
              </div>
              <button
                className="text-white text-base py-2 rounded bg-[#1890FF] w-full md:hidden"
                onClick={() => {
                  dispatch(openLocation(detailLocation));
                  dispatch(closeDetailLocation());
                }}
              >
                {getTranslation(dataContext.translations, 'view-details')}
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={() => dispatch(changeIsDetailBottomSheetOpen(false))}
        />
      </Sheet>
    </>
  );
}
