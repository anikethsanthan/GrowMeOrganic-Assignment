import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface SelectedState {
  selectedArtworks: number[]; 
}

const initialState: SelectedState = {
  selectedArtworks: [],
};

const artworkSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedArtworks.includes(id)) {
        
        state.selectedArtworks = state.selectedArtworks.filter((artworkId) => artworkId !== id);
      } else {
        
        state.selectedArtworks.push(id);
      }
    },
    setSelections: (state, action: PayloadAction<number[]>) => {
      state.selectedArtworks = action.payload;
    },
  },
});

export const { toggleSelection, setSelections } = artworkSlice.actions;
export default artworkSlice.reducer;
