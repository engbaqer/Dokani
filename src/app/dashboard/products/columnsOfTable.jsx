"use client";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";
import {  useDashboardState } from "../StateMangOfDashboard/context";
import UpdateProduct from "./updateProduct";
// ====================== Columns ======================
export const columns = [

  {
    accessorKey: "image_url",
    header: () => (
      <div className="text-right font-semibold text-gray-700">الصورة</div>
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url");
      const fullImageUrl = imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${imageUrl.replace(/\\/g, "/")}`
        : null;

      return (
        <div className="flex items-center">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={row.original.name || "Product"}
              className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs"
            style={{ display: fullImageUrl ? "none" : "flex" }}
          >
            لا توجد صورة
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="text-right font-semibold text-gray-700">الاسم</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 text-right">
        {row.getValue("name") || "غير محدد"}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-right font-semibold text-gray-700">الوصف</div>
    ),
    cell: ({ row }) => (
      <div className="text-gray-700 text-sm text-right max-w-xs truncate">
        {row.getValue("description") || "لا يوجد وصف"}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-right font-semibold text-gray-700">السعر</div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price") || 0);
      const formatted = new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return (
        <div className="text-right font-semibold text-gray-900">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "stock_qty",
    header: () => (
      <div className="text-right font-semibold text-gray-700">المخزون</div>
    ),
    cell: ({ row }) => {
      const stockQty = parseInt(row.getValue("stock_qty") || 0);
      const isLowStock = stockQty < 10;
      return (
        <div className="">
          <span
            className={`inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-lg font-semibold text-sm border ${
              isLowStock
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-green-50 text-green-800 border-green-200"
            }`}
          >
            {stockQty}
          </span>
        </div>
      );
    },
  },
  // ====================== Actions Column ======================
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-gray-700">إجراءات</div>
    ),
    cell: ({ row, table }) => {
      const product = row.original;
      const token = localStorage.getItem("jwt");
      const { setShowTheFormOFupdate, setProductIdForEditing } = useDashboardState();
      const removeRow = table.options.meta?.removeRow;

      const handleDelete = async (e) => {
        e.stopPropagation();
        if (!confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) return;

        try {
          console.log("Deleting product with ID:", product.id);
          await apiRequest(`product/deleteProduct/${product.id}`, {
            method: "DELETE",
            token: token,
          });
          // Remove deleted row from UI
          if (removeRow) {
            removeRow(product.id);
          }
        } catch (error) {
          console.error("Delete error:", error);
          alert("حدث خطأ أثناء الحذف");
        }
      };

      const handleEdit = (e) => {
        e.stopPropagation();
        setShowTheFormOFupdate(true);
        setProductIdForEditing(product.id);
      };

      return (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            تعديل
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            حذف
          </Button>
        </div>
      );
    },
  },
];