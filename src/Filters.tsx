import React from "react";

interface Props {
  stateFilters: any[];
  invoicesState: string;
  handleInvoicesState: (state: string) => void;
}

const Filters: React.FC<Props> = ({
  stateFilters,
  invoicesState,
  handleInvoicesState,
}) => {
  return (
    <div className="flex mx-8 border-b-2">
      {stateFilters.map((state) => (
        <div className="mr-6">
          <p
            onClick={() => handleInvoicesState(state.name)}
            className={
              invoicesState === state.name
                ? "text-violet-600 border-b-2 border-violet-600 pb-6"
                : "text-black"
            }
          >
            {state.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Filters;
