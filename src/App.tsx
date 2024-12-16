import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelections } from "./utils/user";
import { fetchArtworks, Artwork } from "./Data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

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


  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      const fetchedArtworks = await fetchArtworks(selectedPage + 1);
      setArtworks(fetchedArtworks);
      setTotalFetchedArtworks(fetchedArtworks);
      setLoading(false);
    };
    loadArtworks();
  }, [selectedPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseInt(value);
    setInputValue(value === "" || isNaN(parsedValue) ? "" : Math.max(0, parsedValue));
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

  const onPageChange = (event: { first: number; rows: number }) => {
    setSelectedPage(event.first / event.rows);
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
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
            <i
              onClick={(e) => op.current?.toggle(e)}
              className="cursor-pointer absolute top-[3rem] left-[5.25rem] z-10 w-4 fa-solid fa-caret-down"
            ></i>

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
            tableStyle={{ minWidth: "50rem" }}
            onPage={onPageChange}
            totalRecords={500}
            lazy
            selection={getSelectedArtworks()}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            selectionMode="multiple"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
            <Column field="title" header="Title" style={{ width: "20%" }}></Column>
            <Column field="place_of_origin" header="Place of Origin" style={{ width: "10%" }}></Column>
            <Column field="artist_display" header="Artist Display" style={{ width: "25%" }}></Column>
            <Column field="inscriptions" header="Inscriptions" style={{ width: "25%" }}></Column>
            <Column field="date_start" header="Date Start" style={{ width: "5%" }}></Column>
            <Column field="date_end" header="Date End" style={{ width: "5%" }}></Column>
          </DataTable>
        </>
      )}
    </div>
  );
}

export default App;
