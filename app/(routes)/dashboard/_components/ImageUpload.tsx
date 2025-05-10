"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "@/app/provider";
import { toast } from "sonner";

const ImageUpload = () => {
  const AiModelList = [
    { name: "Gemini google", Icon: "/google.png" },
    { name: "llama by Meta", Icon: "/meta.png" },
    { name: "Deepseek", Icon: "/deepseek.png" },
  ];

  const [previewUrl, setPreViewUrl] = useState<string | null>(null);
  const [file, setFiles] = useState<File | null>(null);
  const [model, setModel] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuthContext();

  const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setFiles(selectedFile);
      setPreViewUrl(imageUrl);
    }
  };

  const OnConvertToButtonClick = async () => {
    if (!file || !model || !description) {
      toast.error("Please complete all fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const fileName = Date.now() + ".png";
      const imageRef = ref(storage, "Image_to_Code/" + fileName);
      await uploadBytes(imageRef, file);

      const imageUrl = await getDownloadURL(imageRef);
      const uid = uuidv4();

      const result = await axios.post("/api/Image-to-code", {
        uid: uid,
        model: model,
        description: description,
        imageUrl: imageUrl,
        email: user?.email, // Note: Ensure this is validated in the backend
      });

      toast.success("Uploaded and saved successfully!");
      console.log("Server response:", result.data);

      // Optional: Trigger AI model here if not handled server-side
      // const aiResponse = await fetch("/api/trigger-ai", { method: "POST", body: JSON.stringify({ model, imageUrl, description }) })

    } catch (error) {
      toast.error("Something went wrong during upload.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 flex flex-col items-center justify-center border border-dashed rounded-md shadow-md">
            <CloudUpload className="h-10 w-10 text-primary" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click button to select wireframe Image
            </p>
            <div className="p-5 border-dashed flex mt-7 justify-center">
              <label htmlFor="imageSelect">
                <h2 className="p-2 bg-blue-100 font-medium text-primary rounded-md px-5 cursor-pointer">
                  Select Image
                </h2>
              </label>
              <input
                type="file"
                id="imageSelect"
                className="hidden"
                onChange={OnImageSelect}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 border border-dashed relative">
            <Image
              src={previewUrl}
              alt="preview"
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setPreViewUrl(null)}
            />
          </div>
        )}

        <div className="p-7 border shadow-md rounded-lg">
          <h2 className="font-bold text-lg">Select AI Model</h2>
          <Select onValueChange={setModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelList.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={model.Icon}
                      alt={model.name}
                      width={25}
                      height={25}
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="font-bold text-lg mt-7">
            Enter Description about your WebPage
          </h2>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            className="mt-3 h-[200px]"
            placeholder="(e.g., convert this image into JSX code)"
            value={description}
          />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center">
        <Button onClick={OnConvertToButtonClick}>   
          {loading ? "Uploading..." : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" />
              Convert to Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
