"use client";

import { useState } from "react";
import { Uppy } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { trpcPureClient } from "@/utils/api";
import { Button } from "@/components/Button";

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

  const progress = useUppyState(uppy, (s) => s.totalProgress);
  const files = useUppyState(uppy, (s) => Object.values(s.files));

  return (
    <div className="h-screen flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              // 这里会回调getUploadParameters函数
              uppy.addFile({
                data: file,
              })
            });
          }
        }}
        multiple>
      </input>
      {files.map((file) => {
        const url = URL.createObjectURL(file.data);
        return <img src={url} key={file.id}/>
      })}
      <Button
        onClick={() => {
          uppy.upload();
        }}>
        Upload
      </Button>
      <div>{progress}</div>
    </div>
  )
}