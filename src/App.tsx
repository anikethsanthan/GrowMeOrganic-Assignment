import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useSelector, useDispatch } from "react-redux";
import { toggleSelection, setSelections } from "./utils/user";


interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const op = useRef<OverlayPanel>(null);

  const dispatch = useDispatch();
  const selectedArtworks = useSelector((state: RootState) => state.artworks.selectedArtworks);


  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${selectedPage + 1}`);
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
      setArtworks(fetchedArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [selectedPage]);

  const onPageChange = (event: any) => {
    setSelectedPage(event.first / event.rows);
  };

  const onSelectionChange = (e: any) => {
    const selectedIds = e.value.map((item: Artwork) => item.id);
    dispatch(setSelections(selectedIds));
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
            <Button
              type="button"
              icon="pi pi-image"
              label=">"
              onClick={(e) => op.current?.toggle(e)}
            />
            <OverlayPanel ref={op}>
              <div className="p-3">
                <input type="text" placeholder="Enter Value" className="p-inputtext w-full mb-2" />
                <Button label="Submit" className="w-full" />
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
            selection={artworks.filter((artwork) => selectedArtworks.includes(artwork.id))} // Preselect rows
            onSelectionChange={onSelectionChange} // Update selected rows
            dataKey="id"
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
