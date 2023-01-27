import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';

import { closeLocation } from '@/features/home/homeSlice';

import DetailPopup from '../DetailPopup';
import Header from '../Header';

export default function DetailModal({}) {
  const dispatch = useDispatch();
  const { selectedLocation, detailLocation } = useSelector(
    (state) => state.home,
  );

  const isOpen = !!selectedLocation?.id;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => dispatch(closeLocation())}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="min-h-screen min-w-screen bg-white">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="translate-x-4"
            >
              <Dialog.Panel className="min-h-screen min-w-full">
                {!detailLocation && <Header isDetailModal />}
                {!!selectedLocation && <DetailPopup />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
