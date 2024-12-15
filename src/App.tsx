import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useSelector, useDispatch } from "react-redux";
import { setSelections } from "./utils/user";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

interface RootState {
  artworks: {
    selectedArtworks: number[];
  };
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number | "">(""); 
  const [totalFetchedArtworks, setTotalFetchedArtworks] = useState<Artwork[]>([]); 

  const op = useRef<OverlayPanel>(null);

  const dispatch = useDispatch();
  const selectedArtworks = useSelector((state: RootState) => state.artworks.selectedArtworks);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const json = await response.json();
      const fetchedArtworks = json.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin || "Unknown",
        artist_display: item.artist_display || "Not Available",
        inscriptions: item.inscriptions || "None",
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      return fetchedArtworks;
    } catch (error) {
      console.error("Error fetching artworks:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadInitialPage = async () => {
    const fetchedArtworks = await fetchArtworks(selectedPage + 1);
    setArtworks(fetchedArtworks);
    setTotalFetchedArtworks(fetchedArtworks); 
  };

  useEffect(() => {
    loadInitialPage();
  }, [selectedPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value === "" ? "" : Math.max(0, parseInt(value)));
  };

  const handleInputSubmit = async () => {
    if (typeof inputValue === "number" && inputValue > 0) {
      let requiredArtworks = [...totalFetchedArtworks];
      let currentPage = selectedPage + 1;

     
      while (requiredArtworks.length < inputValue) {
        currentPage++;
        const additionalArtworks = await fetchArtworks(currentPage);
        if (additionalArtworks.length === 0) break; 
        requiredArtworks = [...requiredArtworks, ...additionalArtworks];
      }

     
      const idsToSelect = requiredArtworks.slice(0, inputValue).map((artwork) => artwork.id);
      dispatch(setSelections(idsToSelect)); 
      setTotalFetchedArtworks(requiredArtworks); 
    }
  };

  const onPageChange = (event: any) => {
    setSelectedPage(event.first / event.rows);
  };

  const onSelectionChange = (e: any) => {
    const selectedIds = e.value.map((item: Artwork) => item.id);
    dispatch(setSelections(selectedIds)); 
  };

  const getSelectedArtworks = () => {
    return artworks.filter((artwork) => selectedArtworks.includes(artwork.id));
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-content-center align-middle mt-[20%]">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="card flex justify-content-center mb-4">
          <i  onClick={(e) => op.current?.toggle(e)} 
          className=" cursor-pointer absolute top-[3rem] left-[5.25rem] z-10  w-4 fa-solid fa-caret-down"></i>
            
            <OverlayPanel ref={op}>
              <div className="p-3">
                <input
                  type="number"
                  placeholder="Enter Number"
                  className="p-inputtext w-full mb-2"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Button label="Submit" className="w-full" onClick={handleInputSubmit} />
              </div>
            </OverlayPanel>
          </div>

          <DataTable
            value={artworks}
            paginator
            rows={12}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
            onPage={onPageChange}
            totalRecords={500}
            lazy
            selection={getSelectedArtworks()} 
            onSelectionChange={onSelectionChange} 
            dataKey="id"
            selectionMode="multiple"
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
            <Column field="title" header="Title" style={{ width: '20%' }}></Column>
            <Column field="place_of_origin" header="Place of Origin" style={{ width: '10%' }}></Column>
            <Column field="artist_display" header="Artist Display" style={{ width: '25%' }}></Column>
            <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }}></Column>
            <Column field="date_start" header="Date Start" style={{ width: '5%' }}></Column>
            <Column field="date_end" header="Date End" style={{ width: '5%' }}></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}

export default App;
