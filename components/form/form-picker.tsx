"use client";
import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unspash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { set } from "zod";
import { FormErrors } from "./form-error";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[]> | undefined;
}

const FormPicker = ({ id, errors }: FormPickerProps) => {
  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);

  const [isloading, setIsLoading] = useState(true);

  const [selectedImageId, setSelectedImageId] = useState(null);

  const { pending } = useFormStatus();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (result && result.response) {
          const res = result.response as Array<Record<string, any>>;
          setImages(res);
        } else {
          console.error("Failed to get the images ");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isloading) {
    return (
      <div>
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id} | ${image.urls.thumb} | ${image.links.html} | ${image.user.name} | ${image.urls.full}`}
            />
            <Image alt="Unspash image" fill src={image.urls.thumb} />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};

export default FormPicker;
