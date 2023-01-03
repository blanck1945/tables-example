import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Filters from "./Filters";
import { mockData } from "./fakeData";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

function TableMuCustom() {
  const faekData = mockData;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [invoicesState, setInvoicesState] = useState("all");
  const [initialData, setInitialData] = useState(mockData);
  const rows = useMemo(() => {
    if (invoicesState === "all") return mockData;

    const result = mockData.filter(
      (invoice) => invoice.status === invoicesState
    );

    return result;
  }, [invoicesState]);
  const handleInvoicesState = (state: string) => setInvoicesState(state);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer className="mt-16">
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
      <Table
        className="mt-4"
        sx={{ minWidth: 700 }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Apellido</StyledTableCell>
            <StyledTableCell align="right">Edad</StyledTableCell>
            <StyledTableCell align="right">Visitas</StyledTableCell>
            <StyledTableCell align="right">Progreso</StyledTableCell>
            <StyledTableCell align="right">Estado</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : []
          ).map((row) => (
            <StyledTableRow key={row.first_name}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.first_name}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.last_name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.age}</StyledTableCell>
              <StyledTableCell align="right">{row.visits}</StyledTableCell>
              <StyledTableCell align="right">{row.progress}</StyledTableCell>
              <StyledTableCell align="right">{row.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          //   onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Table>
    </TableContainer>
  );
}

export default TableMuCustom;
