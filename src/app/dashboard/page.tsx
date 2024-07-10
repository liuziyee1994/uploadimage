"use client";

import { useEffect, useState } from "react";
import { UploadSuccessCallback, Uppy } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { trpc, trpcPureClient } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { UploadButton } from "@/components/feature/UploadButton";
import Image from "next/image";
import { Dropzone } from "@/components/feature/Dropzone";
import { cn } from "@/lib/utils";
import DocViewer, { DocViewerRenderers, IConfig } from "react-doc-viewer";
import { usePasteFile } from "@/hooks/usePasteFile";

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

  useEffect(() => {
    const callback: UploadSuccessCallback<{}> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : "blob",
          path: resp.uploadURL ?? "",
          type: file.data.type,
        })
      }
    }
    uppy.on("upload-success", callback);

    return () => {
      uppy.off("upload-success", callback);
    }
  }, [uppy]);

  const { data: fileList, isPending } = trpc.file.listFiles.useQuery();

  usePasteFile({
    onPasteFiles: (files) => {
      uppy.addFiles(
        files.map((file) => ({
          data: file,
        }))
      );
    },
  });

  const files = useUppyState(uppy, (s) => Object.values(s.files));

  return (
    <div className="container mx-auto p-2">
      <div>
        <UploadButton uppy={uppy}></UploadButton>
        <Button
          onClick={() => {
            uppy.upload();
          }}>
          Upload
        </Button>
      </div>
      {isPending && <div>Loading</div>}
      <Dropzone uppy={uppy}>
        {(dragging) => {
          return (
            <div className={cn("flex flex-wrap gap-4 relative border-4 border-gray-50", dragging && "bg-gray-100 border-gray-200 border-dashed")}>
              {
                dragging &&
                <div className="absolute inset-0 bg-secondary/30 flex justify-center items-center">
                  <p className="text-2xl text-gray-400 italic">Drop File Here to Upload</p>
                </div>
              }
              {fileList?.map((file) => {
                return (
                  <div key={file.id} className="w-56 h-56 flex justify-center items-center">
                    <img src={file.url} alt={file.name}/>
                  </div>
                )
              })}
            </div>
          )
        }}
      </Dropzone>
      {files.map((file) => {
        const url = URL.createObjectURL(file.data);
        return <img src={url} key={file.id}/>
      })}
    </div>
  )
}