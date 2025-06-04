import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNotificationOpen: false,
  isAppsOpen: false,
  isProfileOpen: false,
  isDarkMode: (() => {
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference) {
      return storedPreference === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  })(),
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleNotificationDropdown(state) {
      state.isNotificationOpen = !state.isNotificationOpen;
      state.isAppsOpen = false;
      state.isProfileOpen = false;
    },
    toggleAppsDropdown(state) {
      state.isAppsOpen = !state.isAppsOpen;
      state.isNotificationOpen = false;
      state.isProfileOpen = false;
    },
    toggleProfileDropdown(state) {
      state.isProfileOpen = !state.isProfileOpen;
      state.isNotificationOpen = false;
      state.isAppsOpen = false;
    },
    closeAllDropdowns(state) {
      state.isNotificationOpen = false;
      state.isAppsOpen = false;
      state.isProfileOpen = false;
    },
    setDarkMode(state, action) {
      state.isDarkMode = action.payload;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    }
  }
});

export const {
  toggleNotificationDropdown,
  toggleAppsDropdown,
  toggleProfileDropdown,
  closeAllDropdowns,
  setDarkMode,
  toggleDarkMode
} = layoutSlice.actions;

export default layoutSlice.reducer;
