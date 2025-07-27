import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme:'light',
};


export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers:{
        // toggling theme
        toggleTheme:(state)=>{
            state.theme = state.theme === 'dark' ? 'light':'dark';
        },
        // for explicitly setting theme
        setTheme:(state,action) =>{
            state.theme = action.payload
        }
    }
})


export const {toggleTheme,setTheme} = themeSlice.actions;
export default themeSlice.reducer