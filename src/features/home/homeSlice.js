import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobile: false,
  view: 'list',
  selectedLocation: null,
  isDetailBottomSheetOpen: false,
  detailLocation: null,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    changeIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    changeView: (state, action) => {
      state.view = action.payload;
    },
    changeSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    changeDetailLocation: (state, action) => {
      state.detailLocation = action.payload;
    },
    closeLocation: (state) => {
      state.selectedLocation = null;
    },
    changeIsDetailBottomSheetOpen: (state, action) => {
      state.isDetailBottomSheetOpen = action.payload;
    },
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectHome = (state) => state.home;
export const selectIsListView = (state) => state.home.view === 'list';

// Action creators are generated for each case reducer function
export const {
  changeIsMobile,
  changeSelectedLocation,
  changeDetailLocation,
  changeView,
  changeIsDetailBottomSheetOpen,
} = homeSlice.actions;

export const closeLocation = () => async (dispatch) => {
  dispatch(changeSelectedLocation(null));
};

function _convertLocation(location) {
  return {
    ...location,
    createdAt: null,
    updatedAt: null,
    popularTimesUpdatedAt: null,
  };
}

export const openLocation =
  (location, buttonId) => async (dispatch, getState) => {
    const { selectedLocation, isMobile } = selectHome(getState());

    if (buttonId === 'marker' && isMobile) {
      dispatch(changeDetailLocation(_convertLocation(location)));
      dispatch(changeIsDetailBottomSheetOpen(true));
      return;
    }

    // check if location is already selected
    if (selectedLocation?.id && selectedLocation.id === location.id) {
      dispatch(closeLocation());
      dispatch(changeIsDetailBottomSheetOpen(false));
      return;
    }
    dispatch(changeIsDetailBottomSheetOpen(false));
    dispatch(changeSelectedLocation(_convertLocation(location)));
  };

export const closeDetailLocation = () => async (dispatch) => {
  dispatch(changeDetailLocation(null));
};

export const navigateListView = () => async (dispatch) => {
  dispatch(changeView('list'));
  dispatch(changeSelectedLocation(null));
  dispatch(changeDetailLocation(null));
};

export const navigateMapView = () => async (dispatch) => {
  dispatch(changeView('map'));
};

export default homeSlice.reducer;
