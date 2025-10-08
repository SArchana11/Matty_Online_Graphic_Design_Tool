 

import React, { FC, useEffect, useRef, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Square, Circle as CircleIcon, Type, Image as ImageIcon, Save, Download } from "lucide-react";
import toast from "react-hot-toast";
// import { fabric } from "fabric";
import * as fabric from "fabric";


interface Design {
  _id?: string;
  title: string;
  jsonData: any;
  s3Url: string;
}

interface AuthContextType {
  addDesign: (newDesign: Design) => void;
  updateDesign: (id: string, updatedDesignData: Partial<Design>) => void;
  getDesignById: (id: string) => Design | undefined;
  authUser?: any;
}

export const CanvasEditor: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const { designId } = useParams<{ designId?: string }>();
  const navigate = useNavigate();
  const { addDesign, updateDesign, getDesignById, authUser } = useAuth() as AuthContextType;

  // Initialize Fabric canvas and load design if any
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });
    setFabricCanvas(canvas);

    const loadDesign = async () => {
      if (!designId) {
        // toast.success("Canvas ready! Start creating your design.");
        return;
      }

      // 1) Try to get from context
      let existingDesign = getDesignById(designId);

      // 2) If not found, fetch from backend
      if (!existingDesign) {
        try {
          const token = JSON.parse(localStorage.getItem("chat-user") || "{}").token;
          if (!token) throw new Error("Not authorized");
          const res = await fetch(`http://localhost:5000/api/designs/${designId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            existingDesign = await res.json();
            // If backend returns wrapper like { design }, handle it
            // if (existingDesign?.design) existingDesign = existingDesign.design;
            if ("design" in existingDesign) {
              existingDesign = (existingDesign as any).design;
            }

          } else {
            console.warn("Failed to fetch design from server");
          }
        } catch (err) {
          console.error("Error fetching design:", err);
        }
      }

      if (existingDesign?.jsonData) {
        // jsonData may be string or object
        const parsed = typeof existingDesign.jsonData === "string" ? JSON.parse(existingDesign.jsonData) : existingDesign.jsonData;

        // If images in parsed.objects still have data: URIs but design.s3Url exists, try to replace generically.
        // (Backend should already replace base64 with S3 URLs for saved designs.)
        if (existingDesign.s3Url && parsed.objects && Array.isArray(parsed.objects)) {
          parsed.objects = parsed.objects.map((obj: any) => {
            if (obj.type === "image" && obj.src?.startsWith("data:")) {
              // fallback to saved preview if available
              return { ...obj, src: existingDesign.s3Url };
            }
            return obj;
          });
        }

        canvas.loadFromJSON(parsed, () => {
          canvas.renderAll();
          canvas.requestRenderAll();

          // toast.success("Design loaded for editing!");
        });
      } else {
        toast("No design data found to load.");
      }
    };

    loadDesign();

    return () => {
      if (canvas && typeof canvas.dispose === "function") canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designId, getDesignById]);

  // Add shapes
  const addShape = (shapeType: "rectangle" | "circle") => {
    if (!fabricCanvas) return;
    let shape: fabric.Object | null = null;
    if (shapeType === "rectangle") {
      shape = new fabric.Rect({ left: 100, top: 100, fill: "#8B5CF6", width: 100, height: 100, cornerColor: "blue", cornerSize: 8 });
    } else {
      shape = new fabric.Circle({ left: 150, top: 150, fill: "#3B82F6", radius: 50, cornerColor: "blue", cornerSize: 8 });
    }
    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.renderAll();
    }
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.IText("Type here...", {
      left: 100,
      top: 100,
      fill: "#000000",
      fontSize: 32,
      fontFamily: "Inter",
      cornerColor: "blue",
      cornerSize: 8,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  // Image upload handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target?.result as string;
      if (!imgData) return;

      const imgElement = new Image();
      imgElement.src = imgData;
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: 100,
          top: 100,
          scaleX: Math.min(1, 200 / imgElement.width),
          scaleY: Math.min(1, 200 / imgElement.height),
          cornerColor: "blue",
          cornerSize: 8,
        });
        fabricCanvas.add(fabricImg);
        fabricCanvas.centerObject(fabricImg);
        fabricCanvas.setActiveObject(fabricImg);
        fabricCanvas.renderAll();
      };
    };
    reader.readAsDataURL(file);

    // reset input so same file can be re-uploaded
    e.target.value = "";
  };

  // Save design (create or update)
  const handleSave = async () => {
    if (!fabricCanvas) return;

    const canvasJSON = fabricCanvas.toJSON();
    // const thumbnail = fabricCanvas.toDataURL({ format: "png", quality: 0.1 });
    // const fullImage = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    const thumbnail = fabricCanvas.toDataURL({
      format: "png",
      quality: 0.1,
      multiplier: 1,
    });

    const fullImage = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });


    const currentTitle = designId ? getDesignById(designId)?.title : "Untitled Design";
    const designName = prompt("Enter a name for your design:", currentTitle || "Untitled Design");
    if (!designName) return;

    const token = JSON.parse(localStorage.getItem("chat-user") || "{}").token;
    if (!token) {
      toast.error("Not authorized");
      return;
    }

    try {
      let res;
      if (designId) {
        res = await fetch(`http://localhost:5000/api/designs/${designId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: designName, image: fullImage, data: canvasJSON }),
        });
      } else {
        res = await fetch("http://localhost:5000/api/designs/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: designName, image: fullImage, data: canvasJSON }),
        });
      }

      if (!res.ok) throw new Error("Save failed");
      const resJson = await res.json();
      // backend returns `design` or the design object directly
      const returnedDesign = resJson.design || resJson;

      if (designId) {
        updateDesign(designId, { title: designName, jsonData: canvasJSON, s3Url: returnedDesign.s3Url || thumbnail });
        toast.success("Design updated successfully!");
      } else {
        const newDesign: Design = {
          _id: returnedDesign._id,
          title: designName,
          jsonData: canvasJSON,
          s3Url: returnedDesign.s3Url || thumbnail,
        };
        addDesign(newDesign);
        toast.success("Design saved successfully!");
      }

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save design");
    }
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    // const dataURL = fabricCanvas.toDataURL({ format: "png", quality: 1 });
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = `matty-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    toast.success("Design exported as PNG!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Toolbar */}
      <Card className="w-24 m-4 mr-2 shadow-lg flex-shrink-0">
        <CardContent className="p-2 space-y-2">
          <Button title="Rectangle" onClick={() => addShape("rectangle")} variant="ghost" size="icon" className="w-full h-12 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600">
            <Square />
          </Button>
          <Button title="Circle" onClick={() => addShape("circle")} variant="ghost" size="icon" className="w-full h-12 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600">
            <CircleIcon />
          </Button>
          <Button title="Text" onClick={addText} variant="ghost" size="icon" className="w-full h-12 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600">
            <Type />
          </Button>
          <Button title="Image" onClick={() => imageInputRef.current?.click()} variant="ghost" size="icon" className="w-full h-12 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600">
            <ImageIcon />
          </Button>
          <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </CardContent>
      </Card>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col m-4 ml-2">
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Editor</h2>
            <div className="space-x-2">
              <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button onClick={handleExport} variant="outline" className="text-gray-600 hover:bg-gray-100">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-lg">
          <canvas ref={canvasRef} className="border border-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
