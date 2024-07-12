import { Uppy } from "@uppy/core";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/Dialog";
import { useUppyState } from "@/app/dashboard/useUppyState";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import * as R from "ramda";
import { LocalFileItem } from "@/components/feature/FileItem";

export function UploadPreview({ uppy }: { uppy: Uppy }) {
  const files = useUppyState(uppy, (s) => Object.values(s.files));
  console.log(`选中${files.length}张图片`);
  const open = files.length > 0;

  const [index, setIndex] = useState(0);
  const file = files[index];
  console.log("选中的第一张图片:", file);

  const clear = () => {
    files.forEach(file => uppy.removeFile(file.id));
    setIndex(0);
  }

  return file ? (
    <Dialog open={open} onOpenChange={flag => {
      if ((!flag)) {
        clear();
      }
    }}>
      <DialogContent onPointerDownOutside={e => e.preventDefault()}>
        <DialogTitle>Upload Preview</DialogTitle>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => {
            const pre = R.modulo(index - 1 + files.length, files.length);
            setIndex(pre);
          }}>
            <ChevronLeft/>
          </Button>
          <div key={file.id} className="w-56 h-56 flex justify-center items-center">
            <LocalFileItem file={file.data as File}/>
          </div>
          <Button variant="ghost" onClick={() => {
            const next = R.modulo(index + 1, files.length);
            setIndex(next);
          }}>
            <ChevronRight/>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => {
            uppy.removeFile(file.id);
            if (index === files.length - 1) {
              setIndex(files.length - 2);
            }
          }}>
            Delete it
          </Button>
          <Button onClick={() => {
            uppy.upload().then(clear);
          }}>
            Upload All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}