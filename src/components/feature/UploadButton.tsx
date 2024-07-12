import { Uppy } from "@uppy/core";
import { Plus } from 'lucide-react';
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

export function UploadButton({ uppy }: { uppy: Uppy }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}>
        <Plus/>
      </Button>
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              // 这里会回调getUploadParameters函数
              uppy.addFile({
                data: file,
              })
            });
            // 这里要清空数据,避免再次选择同一个图片无法触发onChange事件
            e.target.value = "";
          }
        }}
        multiple
        className="fixed left-[-10000px]">
      </input>
    </>
  )
}