import React, { useContext } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import DataContext from '@/contexts.js';
import { navigateListView, navigateMapView } from '@/features/home/homeSlice';

import { ReactComponent as ListCheckSvg } from '@/assets/images/list-check.svg';
import { ReactComponent as GlobeSvg } from '@/assets/images/globe.svg';

const selectionClassName = `!text-white`;
const defaultClassName =
  'bg-transparent rounded-[40px] text-[#001155] font-semibold text-base py-2 px-6 inline-flex items-center transition-colors duration-300';

function getTextColor(branding, isSelected) {
  if (isSelected) {
    return '#fff';
  }
  return branding?.primaryColor;
}

function getBackgroundColor(branding, isSelected) {
  if (isSelected) {
    return branding?.primaryColor;
  }
  return 'transparent';
}

function ViewSelection() {
  const dataContext = useContext(DataContext);

  const dispatch = useDispatch();
  const isListView = useSelector((state) => state.home.view === 'list');

  const wrapperClass = classNames(
    'fixed z-20 bottom-8 w-full flex justify-center md:hidden',
  );

  return (
    <div className={wrapperClass}>
      <div
        className="flex items-center rounded-[40px] p-[3px] font-display w-min drop-shadow-md"
        style={{
          backgroundColor: dataContext?.branding?.headerBackgroundColor,
        }}
      >
        <button
          className={classNames(defaultClassName, {
            [selectionClassName]: isListView,
          })}
          style={{
            backgroundColor: getBackgroundColor(
              dataContext?.branding,
              isListView,
            ),
          }}
          onClick={() => dispatch(navigateListView())}
        >
          <ListCheckSvg
            style={{ color: getTextColor(dataContext?.branding, isListView) }}
          />
          <span className="ml-2">
            {dataContext?.translations?.['selector-list'] || ''}
          </span>
        </button>
        <button
          className={classNames(defaultClassName, {
            [selectionClassName]: !isListView,
          })}
          style={{
            backgroundColor: getBackgroundColor(
              dataContext?.branding,
              !isListView,
            ),
          }}
          onClick={() => dispatch(navigateMapView())}
        >
          <GlobeSvg
            style={{
              color: getTextColor(dataContext?.branding, !isListView),
            }}
          />
          <span className="ml-2">
            {dataContext?.translations?.['selector-map'] || ''}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ViewSelection;
