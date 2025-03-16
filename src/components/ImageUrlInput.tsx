"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface ImageUrlInputProps {
  onUrlsChange: (urls: string[]) => void;
  initialUrls?: string[];
  label?: string;
  allowEmpty?: boolean;
}

export default function ImageUrlInput({
  onUrlsChange,
  initialUrls = [""],
  label = "Image URLs",
  allowEmpty = false,
}: ImageUrlInputProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls);

  const addUrlInput = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlInput = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    if (newUrls.length === 0 && !allowEmpty) {
      newUrls.push("");
    }
    setUrls(newUrls);
    onUrlsChange(newUrls.filter(Boolean));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    onUrlsChange(newUrls.filter(Boolean));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">{label}</h4>
        <Button type="button" variant="outline" size="sm" onClick={addUrlInput}>
          <Plus className="h-4 w-4 mr-2" />
          Add another URL
        </Button>
      </div>
      {urls.map((url, index) => (
        <div key={index} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeUrlInput(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
