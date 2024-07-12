import { UploadCallback, UploadSuccessCallback, Uppy } from "@uppy/core";
import { trpc, trpcPureClient } from "@/utils/api";
import { useEffect, useState } from "react";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { LocalFileItem, RemoteFileItem } from "@/components/feature/FileItem";

export function FileGrid({ uppy }: { uppy: Uppy }) {
  const { data: uploadedFiles, isPending } = trpc.file.listFiles.useQuery();
  const [uploadingFileIDs, setUploadingFileIDs] = useState<string[]>([]);
  const uppyFiles = useUppyState(uppy, s => s.files);

  const utils = trpc.useUtils();

  useEffect(() => {
    const uploadSuccessCallback: UploadSuccessCallback<{}> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : "blob",
          path: resp.uploadURL ?? "",
          type: file.data.type,
        }).then(newData => {
          utils.file.listFiles.setData(void 0, (oldData) => {
            if (!oldData) {
              return [newData];
            }
            return [newData, ...oldData];
          })
        })
      }
    }

    const uploadStartCallback: UploadCallback = (data) => {
      setUploadingFileIDs(currentFiles => [...currentFiles, ...data.fileIDs]);
    }

    const uploadDoneCallback = () => {
      setUploadingFileIDs([]);
    }

    uppy.on("upload-success", uploadSuccessCallback);
    uppy.on("upload", uploadStartCallback);
    uppy.on("complete", uploadDoneCallback);

    return () => {
      uppy.off("upload-success", uploadSuccessCallback);
      uppy.off("upload", uploadStartCallback);
      uppy.off("complete", uploadDoneCallback);
    }
  }, [uppy, utils]);

  return (
    <>
      {isPending && <div>Loading</div>}
      <div className={"flex flex-wrap gap-4 relative border-4 border-gray-50"}>
        {
          uploadingFileIDs.length > 0 && uploadingFileIDs.map(id => {
            const file = uppyFiles[id];
            return (
              <div key={file.id} className="w-56 h-56 flex justify-center items-center">
                <LocalFileItem file={file.data as File}/>
              </div>
            )
          })
        }
        {uploadedFiles?.map((file) => {
          return (
            <div key={file.id} className="w-56 h-56 flex justify-center items-center">
              <RemoteFileItem url={file.url} name={file.name} contentType={file.contentType}/>
            </div>
          )
        })}
      </div>
    </>
  )
}