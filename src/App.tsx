import { useState } from "react";
import { mockData } from "./fakeData";
import EnhancedTable from "./OrderBy";
import TableV7 from "./TableV7";
import Tablev8 from "./TableV8";

const App = () => {
  const [tableEngine, setTableEngine] = useState("MU");

  const columns = [
    {
      Header: "Nombre",
      accessor: "first_name",
    },
    {
      Header: "Apellido",
      accessor: "last_name",
    },
    {
      Header: "Edad",
      accessor: "age",
    },
    {
      Header: "Visitas",
      accessor: "visits",
    },
    {
      Header: "Progreso",
      accessor: "progress",
    },
    {
      Header: "Estado",
      accessor: "status",
    },
  ];

  const handleChange = (tableEngine: string) => {
    console.warn({ tableEngine, msg: "Usando este handle" });
    setTableEngine(tableEngine);
  };
  return (
    <div className="px-8">
      <div className="bg-slate-800 flex justify-around m-auto w-1/2 ">
        <button onClick={() => handleChange("MU")}>MU</button>
        <button onClick={() => handleChange("tableV7")}>React table V7</button>
        <button onClick={() => handleChange("TanStack")}>
          TanStack table V8
        </button>
      </div>
      {tableEngine === "MU" && <EnhancedTable />}
      {tableEngine === "tableV7" && (
        <TableV7 columnsData={columns} dataArr={mockData} />
      )}
      {tableEngine === "TanStack" && <Tablev8 />}
    </div>
  );
};

export default App;
