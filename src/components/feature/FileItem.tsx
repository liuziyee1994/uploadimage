import Image from "next/image";
import { useMemo } from "react";

export function FileItem({ url, name, isImage }: { url: string, name: string, isImage: boolean }) {
  return isImage ? (
    <img src={url} alt={name}/>
  ) : (
    <Image src="" alt="unknown file type" width={100} height={100}/>
  )
}

export function LocalFileItem({ file }: { file: File }) {
  const isImage = file.type.startsWith("image");

  const url = useMemo(() => {
    if (isImage) {
      return URL.createObjectURL(file);
    }
    return "";
  }, [isImage, file]);

  return <FileItem url={url} name={file.name} isImage={isImage}></FileItem>
}

export function RemoteFileItem({ url, name, contentType }: { url: string, name: string, contentType: string }) {
  const isImage = contentType.startsWith("image");

  return <FileItem url={url} name={name} isImage={isImage}/>;
}