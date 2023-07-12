import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import AgridTablesFile from "../../Assessment/AgridTablesFile";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { UserContext } from "../../../context/ContextProvider";
type outlineTableType = {
  id: number;
  description: string;
  file_name: string;
  location: string;
  primary_types: string;
  inputs: string;
  outputs: string;
};
// const columns: GridColDef[] = [
//
// ];

// const rows = [
//   {
//     id: "Name of display item (e.g. Table 1 , Figure S3)",
//   },
//   {
//     id: "Estimate",
//   },
//   {
//     id: "Standard Error",
//   },
//   {
//     id: "Units (e.g. %,$,loh($),elasticity, standard)",
//   },
//   {
//     id: "p-value",
//   },
//   {
//     id: "Confidence interval",
//   },
//   {
//     id: "Other Statistic",
//   },
//   {
//     id: "Page",
//   },
//   {
//     id: "Column",
//   },
//   {
//     id: "Row",
//   },
//   {
//     id: "Inline Paragraph",
//   },
//   {
//     id: "Econometric Method",
//   },
//   {
//     id: "Specify method()if other selected",
//   },
// ];

export default function TableData() {
  const { store, setStore } = UserContext();
  const gridRef = useRef<AgGridReact<any>>(null);
  // const columns: GridColDef[] = [

  // ];

  const [rowData, setRowData] = useState<outlineTableType[]>([]);

  // Each Column Definition results in one Column.
  const [outlineClaimsColumnDefs, setOutlineClaimsColumnDefs] = useState([
    {
      field: "firstName",
      headerName: "Preferred Specification",
      width: 170,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Alternative Spec #1",
      width: 150,
      editable: true,
    },
    {
      field: "age01",
      headerName: "Alternative Spec #2",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "age02",
      headerName: "Alternative Spec #3",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "age03",
      headerName: "Alternative Spec #4",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "age04",
      headerName: "Alternative Spec #5",
      type: "number",
      width: 150,
      editable: true,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 300,
      maxWidth: 200,
      autoHeight: false,
    }),
    []
  );

  const cellClickedListener = useCallback(
    (params: any) => {
      console.log("click listener data:", params.data);

      const fieldId = params.data?.id;
      console.log("row id:", fieldId);

      setStore((prev: any) => {
        // Ensure paperData and data_source_rows exist
        const paperData = prev?.paperData || {};
        let data_source_rows = paperData?.data_source_rows || [];

        // Check if the row already exists
        const existingRow = data_source_rows.find(
          (item: any) => item.id === fieldId
        );

        if (existingRow) {
          data_source_rows = data_source_rows.map((item: any) => {
            if (item.id === fieldId) {
              return params.data;
            } else {
              return item;
            }
          });
        } else {
          data_source_rows.push(params.data);
        }

        return {
          ...prev,
          paperData: {
            ...paperData,
            data_source_rows: data_source_rows,
          },
        };
      });
    },
    [setStore]
  );

  // Example load data from server
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e: any) => {
    if (gridRef.current) {
      gridRef.current.api.deselectAll();
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Example using Grid's API */}
      <button onClick={buttonListener}>Deselect</button>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 300 }}>
        <AgridTablesFile
          gridRef={gridRef}
          rowData={rowData}
          columnDefs={outlineClaimsColumnDefs}
          defaultColDef={defaultColDef}
          cellClickedListener={cellClickedListener}
        />
      </div>
    </Box>
  );
}
