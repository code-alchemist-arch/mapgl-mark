import { useContext } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { ReactComponent as ArrowBackSvg } from '@/assets/images/arrow-back.svg';

import DataContext from '@/contexts';
import { closeLocation } from '@/features/home/homeSlice.js';

function Header({ isDetailModal }) {
  const dispatch = useDispatch();
  const dataContext = useContext(DataContext);

  return (
    <div
      className="z-10 fixed lg:relative w-screen lg:w-full flex flex-shrink-0 border-b border-solid border-[#D5E2ED] justify-between items-center px-4 pt-4 lg:pt-11 pb-3"
      style={{
        backgroundColor: dataContext?.branding?.headerBackgroundColor,
      }}
    >
      {isDetailModal && (
        <ArrowBackSvg
          className="block lg:hidden"
          onClick={() => dispatch(closeLocation('header'))}
        />
      )}
      {!isDetailModal && (
        <h2 className="font-bold text-5 leading-4 text-black text-2xl">
          {dataContext?.branding?.productName || 'Locations'}
        </h2>
      )}
      <div className={classNames({ 'py-[7px]': isDetailModal })}>
        <img
          className="h-12"
          alt={dataContext?.branding?.productName}
          src={dataContext?.branding?.logoUrl}
        />
      </div>
    </div>
  );
}

export default Header;
