import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

// Define the structure for the API data
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
  const [selectedProducts, setSelectedProducts] = useState<Artwork[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 




  // Fetch data from the API
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
    }finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchArtworks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const onPageChange = (event: any) => {
    setSelectedPage(event.first / event.rows); 
    console.log("Current Page:", event.first / event.rows + 1); 
  };

  return (
    <div>
      

      {loading ? (
      <div className="flex justify-content-center align-middle mt-[20%]">
        <ProgressSpinner />
      </div>
    ) : (
      <DataTable
        value={artworks}
        paginator
        rows={12}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        onPage={onPageChange} 
        totalRecords={500} 
        lazy 
        selection={selectedProducts} // Bind the selected rows to the state
        onSelectionChange={(e) => setSelectedProducts(e.value)} // Update selected rows on change
        dataKey="id" // Use 'id' as the unique key for each row
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} className=''></Column> {/* Checkbox column */}
        <Column field="title" header="Title" style={{ width: '20%' }}></Column>
        <Column field="place_of_origin" header="Place of Origin" style={{ width: '10%' }}></Column>
        <Column field="artist_display" header="Artist Display" style={{ width: '25%' }}></Column>
        <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }}></Column>
        <Column field="date_start" header="Date Start" style={{ width: '5%' }}></Column>
        <Column field="date_end" header="Date End" style={{ width: '5%' }}></Column>
      </DataTable>
    )}
    </div>
  );
}

export default App;
