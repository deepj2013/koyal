import React from "react";

interface Column {
  key: string;
  label: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  renderCell?: (item: any, columnKey: string) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, renderCell }) => {
  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid gap-4 p-3 bg-gray-100 border-b text-gray-600 text-sm font-semibold"
           style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((col) => (
          <span key={col.key} className={`pl-3 ${col.className || ""}`}>
            {col.label}
          </span>
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y overflow-y-auto">
        {data.map((item, rowIndex) => (
          <div key={rowIndex} 
               className="grid gap-4 items-center p-4"
               style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            {columns.map((col) => (
              <div key={col.key} className={col.className || ""}>
                {renderCell ? renderCell(item, col.key) : item[col.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
