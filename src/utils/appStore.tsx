import { configureStore } from "@reduxjs/toolkit";
import artworkReducer from "./user";




const appStore =configureStore({

    reducer:{
        artworks: artworkReducer,
       
    }
})

export default appStore;