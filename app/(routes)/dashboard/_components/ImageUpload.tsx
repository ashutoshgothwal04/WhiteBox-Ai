"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Sparkles, WandSparkles, X } from "lucide-react";
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

const ImageUpload = () => {
  const AiModelList = [
    {
      name: "Gemini google",
      Icon: "/google.png",
    },
    {
      name: "llama by Meta",
      Icon: "/meta.png",
    },
    {
      name: "Deepseek",
      Icon: "/deepseek.png",
    },
  ];
  const [previewUrl, setPreViewUrl] = useState<string | null>(null);
  const [file, setFiles] = useState<any>();

  const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setFiles(files[0]);
      setPreViewUrl(imageUrl);
    }

    const OnConvertToButtonClick = async () => {
      // save image to firebase
      const fileName = Date.now() + ".png";
      const imageRef = ref(storage, "Image_to_Code" + fileName);
      await uploadBytes(imageRef, file).then((resp) => {
        console.log(resp);
      });
      const imageUrl = await getDownloadURL(imageRef);
      console.log(imageUrl);
    };
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Upload  */}
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
            </div>
            <input
              type="file"
              id="imageSelect"
              className="hidden"
              onChange={OnImageSelect}
              multiple={false}
            />
          </div>
        ) : (
          <div className="p-5 border border-dashed">
            <Image
              src={previewUrl}
              alt="preview"
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="flex justify-end w-full cursor-pointer"
              onClick={() => setPreViewUrl(null)}
            />
          </div>
        )}

        {/* user input textarea */}
        <div className="p-7 border shadow-md rounded-lg ">
          <h2 className="font-bold text-lg ">Select AI Model</h2>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Ai Model" />
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
            className="mt-3 h-[200px]"
            placeholder="(e.g., convert this image into JSX code)"
            required
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Button>
          {" "}
          <WandSparkles /> Convert to Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
