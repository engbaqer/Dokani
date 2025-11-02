"use client";
import { useState } from "react";
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
import {  useDashboardState } from "../StateMangOfDashboard/context";
export default function ProductUpdateForm() {
  const [selectedField, setSelectedField] = useState(""); // key to update
  const [newValue, setNewValue] = useState(""); // new value
  const {   setShowTheFormOFupdate ,ProductIdForEditing } = useDashboardState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedField || !newValue) {
      alert("⚠️ يرجى اختيار الحقل وكتابة القيمة الجديدة");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");

      // prepare request body as dynamic key-value
      const body = { [selectedField]: newValue };

      await apiRequest(`product/updateProduct/${ProductIdForEditing}`, {
        method: "PUT",
        body: body,
        headers: { "Content-Type": "application/json" },
        token,
      });

      alert("✅ تم تحديث المنتج بنجاح!");
      setSelectedField("");
      setNewValue("");
    } catch (error) {
      console.error("❌ Error updating product:", error);
      alert("فشل تحديث المنتج");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>تحديث بيانات المنتج</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Select field */}
          <div className="grid gap-2">
            <Label htmlFor="field">اختر الحقل المراد تعديله</Label>
            <select
              id="field"
              className="border p-2 rounded"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">اختر.....</option>
              <option value="name">الاسم</option>
              <option value="description">الوصف</option>
              <option value="price">السعر</option>
              <option value="stock_qty">الكمية</option>
         
            </select>
          </div>

          {/* Input for new value */}
          <div className="grid gap-2">
            <Label htmlFor="newValue">ادخل القيمة الجديدة</Label>
            <Input
              id="newValue"
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <CardFooter className="flex-col gap-2 px-0">
            <Button type="submit" className="w-full">
              تحديث
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedField("");
                setNewValue("");
                setShowTheFormOFupdate("")
              }}
            >
              إلغاء
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
