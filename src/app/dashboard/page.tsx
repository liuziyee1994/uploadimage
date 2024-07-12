"use client";

import { useState } from "react";
import { Uppy } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { trpcPureClient } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { UploadButton } from "@/components/feature/UploadButton";
import { Dropzone } from "@/components/feature/Dropzone";
import { usePasteFile } from "@/hooks/usePasteFile";
import { UploadPreview } from "@/components/feature/UploadPreview";
import { FileGrid } from "@/components/feature/FileGrid";

export default function Home() {
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        console.log(file);
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : "blob",
          contentType: file.data.type || "",
          size: file.size,
        });
      },
    });
    return uppy;
  });

  usePasteFile({
    onPasteFiles: (files) => {
      uppy.addFiles(
        files.map((file) => ({
          data: file,
        }))
      );
    },
  });

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            uppy.upload();
          }}>
          Upload
        </Button>
        <UploadButton uppy={uppy}></UploadButton>
      </div>
      <Dropzone uppy={uppy} className="relative">
        {dragging => {
          return (
            <>
              {
                dragging &&
                <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center">
                  <p className="text-2xl text-gray-400 italic">Drop File Here to Upload</p>
                </div>
              }
              <FileGrid uppy={uppy}/>
            </>
          )
        }
        }
      </Dropzone>
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  )
}