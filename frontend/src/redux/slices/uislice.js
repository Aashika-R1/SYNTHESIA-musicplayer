import {createSlice} from '@reduxjs/toolkit';

const uislice = createSlice({
  name: 'ui',
  initialState: {
    authModalOpen: false,
    authMode : 'login',
    },
    reducers: {
        
        openAuthModal: (state , action) => {
            state.authModalOpen = true;
            state.authMode = action.payload || 'login';
        },
        closeAuthModal: (state , action) => {
            state.authModalOpen = false;
            state.authMode="login";
        },
        switchAuthMode: (state , action) => {
            state.authMode = action.payload;
        },
    },
});

export const {openAuthModal ,
     closeAuthModal ,
     switchAuthMode
    } = uislice.actions;

export default uislice.reducer;