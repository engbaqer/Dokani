"use client";
import { columns } from "./ordersOfStore";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ====================== Orders Page Component ======================
export default function OrdersPage() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
// const token = localStorage.getItem("jwt");
  // === Fetch orders on mount ===
  React.useEffect(() => {
    const fetchOrders = async () => {
      const storeId = localStorage.getItem("storeId");
      try {
        setLoading(true);
        // Update this endpoint to match your orders API
        const response = await apiRequest(`order/getOrderItemsByStore/${storeId}`, {
          method: "GET",
          // token: token,
        });
        console.log("Fetched orders:", response);
        setData(response || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback to empty array if API fails
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Function to update order status
  const updateOrderStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 2 : 1; // Toggle between 1 and 2
      const response = await apiRequest(`order/changeOrderItemStatus/${orderId}`, {
        method: "PUT",
        body: { status_of_orders: newStatus },
        // token: token,
      });
      
      // Update the local state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === orderId
            ? { ...item, status_of_orders: newStatus }
            : item
        )
      );
      
      console.log("Status updated successfully:", response);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("فشل تحديث حالة الطلب. يرجى المحاولة مرة أخرى.");
    }
  };

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
      updateOrderStatus,
    },
  });

  // Calculate statistics
  const totalOrders = data.length;
  const totalRevenue = data.reduce((sum, orderItem) => {
    const price = parseFloat(orderItem.price || orderItem.unit_price || 0);
    const quantity = parseInt(orderItem.quantity || 0);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="w-full p-6 pt-24 space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الطلبات</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة جميع طلبات المتجر</p>
        </div>

      </div>

      {/* Filters and Search Section */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 w-full md:w-auto">
              <Input
                placeholder="بحث في الطلبات (رقم الطلب، اسم المنتج...)"
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {table.getFilteredRowModel().rows.length} من {totalOrders} طلب
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] w-full">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 text-lg">جارِ تحميل الطلبات...</p>
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
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        // Handle row click - could open order details
                        console.log("Order clicked:", row.original);
                      }}
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">
                          لا توجد طلبات
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          لم يتم العثور على أي طلبات تطابق معايير البحث
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
    </div>
  );
}
