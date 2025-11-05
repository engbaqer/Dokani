"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/request";

export default function ProductForm({ setShowForm, selectedItem }) {
  // Load store_id from localStorage or use 12 as fallback
  const storeId = localStorage.getItem("storeId");

  const [formData, setFormData] = useState({
    store_id: storeId,
    name: "",
    description: "",
    price: "",
    stock_qty: "",
    sku: "",
    logo: null,
  });

  // Prefill data if editing an item
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        store_id: storeId,
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        price: selectedItem.price || "",
        stock_qty: selectedItem.stock_qty || "",
        sku: selectedItem.sku || "",
        logo: null, // file inputs can’t be prefilled for security
      });
    }
  }, [selectedItem, storeId]);

  // Handle field changes
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "logo"
          ? files[0] // store actual file object
          : ["price", "stock_qty"].includes(id)
          ? Number(value)
          : value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");

      // Create FormData for file upload
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      await apiRequest("product/createProduct", {
        method: "POST",
        body: form,
        token,
        isFormData: true,
      });

      // Reset form
      setFormData({
        store_id: storeId,
        name: "",
        description: "",
        price: "",
        stock_qty: "",
        sku: "",
        logo: null,
      });

      alert("✅ Product saved successfully!");
      if (typeof setShowForm === "function") setShowForm(false);
    } catch (error) {
      console.error("❌ Error saving product:", error);
      alert("Failed to save product");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>اضافة منتج</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">وصف</Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">السعر</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock_qty">الكمية</Label>
            <Input
              id="stock_qty"
              type="number"
              value={formData.stock_qty}
              onChange={handleChange}
              required
            />
          </div>

          {/* Optional SKU field */}
          {/* <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
            />
          </div> */}

          <div className="grid gap-2">
            <Label htmlFor="logo">صوره المنتج</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <CardFooter className="flex-col gap-2 px-0">
            <Button type="submit" className="w-full">
              اضافة
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setFormData({
                  store_id: storeId,
                  name: "",
                  description: "",
                  price: "",
                  stock_qty: "",
                  sku: "",
                  logo: null,
                });
                if (typeof setShowForm === "function") setShowForm("");
              }}
            >
              الغاء
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
