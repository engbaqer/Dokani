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

export default function ProductForm({ setShowForm, showTheForm, selectedItem }) {
  // Load store_id from localStorage or use 12 as fallback
  const storeId = localStorage.getItem("store_id") || 12;

  const [formData, setFormData] = useState({
    store_id: storeId,
    name: "",
    description: "",
    price: "",
    stock_qty: "", // this is statct value 
    sku: "",
    image_url: "",
  });

  // If editing an item, prefill form
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        store_id: storeId,
        name: selectedItem.name || "", 
        description: selectedItem.description || "", 
        price: selectedItem.price || "",
        stock_qty: selectedItem.stock_qty || "",
        sku: selectedItem.sku || "", // this is statct value 
        image_url: selectedItem.image_url || "",
      });
    }
  }, [selectedItem, storeId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: ["price", "stock_qty"].includes(id) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");

      await apiRequest("product/createProduct", {
        method: "POST",
        body: formData,
        token,
      });

      alert(`✅ Product saved successfully!`);
      setFormData({
        store_id: storeId,
        name: "",
        description: "",
        price: "",
        stock_qty: "",
     sku: "", // this is statct value 
        image_url: "",
      });

      if (typeof setShowForm === "function") setShowForm(false);
    } catch (error) {
      console.error("❌ Error saving product:", error);
      alert("Failed to save product");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {showTheForm === "edit" ? "Edit Product" : "Add Product"}
        </CardTitle>
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
{/* ======================================= */}

          {/* <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div> */}
{/* ======================================= */}
          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>

          <CardFooter className="flex-col gap-2 px-0">
            <Button type="submit" className="w-full">
              SAVE
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
                  image_url: "",
                });
                if (typeof setShowForm === "function") setShowForm("");
              }}
            >
              CANCEL
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
