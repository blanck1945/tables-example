import React, { useState } from "react";
import Filters from "./Filters";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useRowSelect,
} from "react-table";

interface Props {
  columnsData: any[];
  dataArr?: any[];
}

const IndeterminateCheckbox: React.FC<any> = React.forwardRef<any>(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef: any = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const TableV7: React.FC<Props> = ({ columnsData, dataArr = [] }) => {
  const [invoicesState, setInvoicesState] = useState("all");
  const [invoiceData, setInvoiceData] = useState(dataArr);
  const columns = React.useMemo(() => columnsData, []);

  const filterTypes = React.useMemo(
    () => ({
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const data = React.useMemo(() => {
    if (invoicesState === "all") return invoiceData;

    const result = invoiceData.filter(
      (invoice) => invoice.status === invoicesState
    );

    return result;
  }, [invoicesState]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const handleInvoicesState = (state: string) => setInvoicesState(state);

  return (
    <div className="mt-16 w-full">
      <Filters
        stateFilters={[
          { name: "all", label: "Todas" },
          { name: "single", label: "Single" },
          { name: "relationship", label: "Relationship" },
          { name: "complicated", label: "Complicated" },
        ]}
        invoicesState={invoicesState}
        handleInvoicesState={handleInvoicesState}
      />
      <table
        {...getTableProps()}
        className="border-2 mt-8"
        style={{ width: "50%" }}
      >
        <thead className="h-16 bg-gray-100 text-gray-500 w-8">
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr className="w-8" {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th className="text-left pl-4">
                      <div
                        className={
                          column.id.includes("select") ? "w-4" : "w-44"
                        }
                      >
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                      <div className="flex">
                        {
                          // Render the header
                          <p
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {column.render("Header")}
                          </p>
                        }
                        <span className="ml-2">
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </div>
                    </th>
                  ))
                }
              </tr>
            ))
          }
          <tr></tr>
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            page.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td
                          className="pl-4 h-16 border-b-2 text-gray-900 text-left"
                          {...cell.getCellProps()}
                        >
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <div className="h-16 flex justify-between px-4 bg-slate-600 pt-4">
        <div>
          <button
            className="mx-4"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="mr-4"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          <button
            className="mr-4"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="mr-4"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span className="ml-4">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
        {/* <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "} */}
        <select
          value={pageSize}
          className="h-8 px-4 bg-slate-900"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TableV7;

// Define a default UI for filtering
function DefaultColumnFilter({ column }: any) {
  const { filterValue, preFilteredRows, setFilter } = column;
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}
