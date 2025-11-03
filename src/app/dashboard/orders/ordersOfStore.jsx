"use client";
import { Button } from "@/components/ui/button";

// ====================== Order Item Columns ======================
export const columns = [
  {
    accessorKey: "id",
    header: () => (
      <div className="text-right font-semibold text-gray-700">رقم الطلب</div>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-semibold text-gray-900">
        #{row.getValue("id")}
      </div>
    ),
  },
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
        <div className="flex items-center ">
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
      <div className="text-right font-semibold text-gray-700">اسم المنتج</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 text-right">
        {row.getValue("name") || "غير محدد"}
      </div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: () => (
      <div className="text-right font-semibold text-gray-700">رقم الهاتف</div>
    ),
    cell: ({ row }) => {
      const phoneNumber =
        row.getValue("phone_number") ||
        "غير محدد";
      return (
        <div className="font-medium text-gray-900 text-right">
          {phoneNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="text-right font-semibold text-gray-700">السعر</div>
    ),
    cell: ({ row }) => {
      const price = parseFloat(
        row.getValue("price") || row.original.unit_price || 0
      );
      const formatted = new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);

      return (
        <div className="text-right font-semibold text-gray-900">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: () => (
      <div className="text-right font-semibold text-gray-700">الكمية</div>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") || 0;
      return (
        <div className="">
          <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-lg bg-blue-50 text-blue-800 font-semibold text-sm border border-blue-200">
            {quantity}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status_of_orders",
    header: () => (
      <div className="text-right font-semibold text-gray-700">الحالة</div>
    ),
    cell: ({ row, table }) => {
      const statusOfOrders = row.original.status_of_orders || row.getValue("status_of_orders");
      const orderId = row.original.id;
      const isPending = statusOfOrders === 1;
      const updateOrderStatus = table.options.meta?.updateOrderStatus;

      const handleClick = async () => {
        if (updateOrderStatus) {
          await updateOrderStatus(orderId, statusOfOrders);
        }
      };

      return (
        <div className="flex ">
          <Button
            onClick={handleClick}
            className={
              isPending
                ? "bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                : "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
            }
          >
            {isPending ? "انتظار" : "مكتمل"}
          </Button>
        </div>
      );
    },
  },
];