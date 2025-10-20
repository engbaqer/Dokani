"use client";

import * as React from "react";
import AddProduct from "./addProduct"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { apiRequest } from "@/lib/request"; // ✅ same API helper you used in LoginForm

// ====================== Columns ======================
export const columns = [
  {
    accessorKey: "image_url",
    header: () => (
      <Button variant="ghost" className="flex w-full justify-start">
        الصورة
      </Button>
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url");
      return (
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt="Product"
            className="h-12 w-12 rounded-md object-cover border"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <Button variant="ghost" className="flex w-full justify-start">
        الاسم
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: () => (
      <Button variant="ghost" className="flex w-full justify-start">
        الوصف
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">السعر</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock_qty",
    header: () => (
      <Button variant="ghost" className="flex w-full justify-start">
        الكمية
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("stock_qty")}</div>,
  },
];

// ====================== Main Component ======================
export default function DataTableDemo() {
  const [data, setData] = React.useState([]); // ✅ empty initially
  const [loading, setLoading] = React.useState(true);

  // === Fetch products on mount ===
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("product/getProductsByStore/store/12", {
          method: "GET",
        });
        console.log("Fetched products:", response);
        setData(response || []); // assuming backend returns array
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showTheForm, setShowTheForm] = React.useState("");
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full p-5 pt-20" dir="rtl">
  
      <div className="flex items-center py-4">
        <Input
          placeholder="فلترة حسب الاسم..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border border-black"
        />
        <Button onClick={()=>setShowTheForm("true")} variant="outline " className='mr-5 bg-green-500 cursor-pointer'>اضافة منتج</Button>
      </div>

      <div className="overflow-hidden rounded-md border bg-white">
        {loading ? (
          <div className="p-10 text-center text-gray-500">جارِ التحميل...</div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {/* =================form ============= */}
      {showTheForm !== "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <AddProduct
            setShowForm={setShowTheForm}
            showTheForm={showTheForm}
            
            className="relative bg-white rounded-xl shadow-xl p-6"
          />
        </div>
      )}
      {/* =================form ============= */}

    </div>
  );
}
