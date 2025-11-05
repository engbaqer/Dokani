"use client";
import { columns } from "./columnsOfTable";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Button } from "@/components/ui/button";
import UpdateProduct from "./updateProduct";
import AddProduct from "./addProduct";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { apiRequest } from "@/lib/request";
import { useDashboardState } from "../StateMangOfDashboard/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ====================== Products Page Component ======================
export default function ProductsPage() {
  const { showTheForm, setShowTheForm, showTheFormOFupdate, setShowTheFormOFupdate } = useDashboardState();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // === Fetch products on mount ===
  React.useEffect(() => {
    const fetchProducts = async () => {
      const storeId = localStorage.getItem("storeId");
      try {
        setLoading(true);
        const response = await apiRequest(`product/getProductsByStore/store/${storeId}`, {
          method: "GET",
        });
        console.log("Fetched products:", response);
        setData(response || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setData([]);
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    meta: {
      removeRow: (id) => setData((prev) => prev.filter((p) => p.id !== id)),
    },
  });

  // Calculate statistics
  const totalProducts = data.length;

  return (
    <div className="w-full p-6 pt-24 space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
            <p className="text-gray-600 mt-1">إدارة ومتابعة جميع منتجات المتجر</p>
          </div>
          <Button
            onClick={() => setShowTheForm("true")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 shadow-md"
          >
            + إضافة منتج
          </Button>
        </div>

      </div>

      {/* Filters and Search Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 w-full md:w-auto">
              <Input
                placeholder="بحث في المنتجات (الاسم، الوصف، السعر...)"
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {table.getFilteredRowModel().rows.length} من {totalProducts} منتج
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 text-lg">جارِ تحميل المنتجات...</p>
            </div>
          ) : (
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-gray-700 py-4"
                        >
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
                      <TableRow
                        key={row.id}
                        className="hover:bg-blue-50/50 transition-colors border-b border-gray-100"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-4 text-gray-700"
                          >
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
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <svg
                            className="w-16 h-16 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-gray-500 text-lg font-medium">
                            لا توجد منتجات
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            لم يتم العثور على أي منتجات تطابق معايير البحث
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {!loading && table.getRowModel().rows.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                الصفحة {table.getState().pagination.pageIndex + 1} من{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  التالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showTheForm !== "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="relative  rounded-xl  max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AddProduct
              setShowForm={setShowTheForm}
              showTheForm={showTheForm}
            />
          </div>
        </div>
      )}
      {showTheFormOFupdate !== "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="relative  rounded-xl  max-w-md w-full max-h-[90vh] overflow-y-auto">
            <UpdateProduct
              setShowForm={setShowTheFormOFupdate}
              showTheForm={showTheFormOFupdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
