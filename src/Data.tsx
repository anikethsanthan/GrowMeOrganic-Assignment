import { API_URL } from "./utils/constants";

export interface Artwork {
    id: number;
    title: string;
    place_of_origin: string | null;
    artist_display: string | null;
    inscriptions: string | null;
    date_start: number | null;
    date_end: number | null;
  }
  
  export interface ArtworkAPIResponse {
    id: number;
    title: string;
    place_of_origin?: string;
    artist_display?: string;
    inscriptions?: string;
    date_start?: number;
    date_end?: number;
  }
  

  export const fetchArtworks = async (page: number): Promise<Artwork[]> => {
    try {
      const response = await fetch(API_URL +page);
      const json = await response.json();
      return json.data.map((item: ArtworkAPIResponse) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin || "Unknown",
        artist_display: item.artist_display || "Not Available",
        inscriptions: item.inscriptions || "None",
        date_start: item.date_start,
        date_end: item.date_end,
      }));
    } catch (error) {
      console.error("Error fetching artworks:", error);
      return [];
    }
  };
  