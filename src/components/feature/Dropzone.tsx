import { Uppy } from "@uppy/core";
import { ReactNode, useRef, useState } from "react";

export function Dropzone({ uppy, children }: { uppy: Uppy, children: ReactNode | ((dragging: boolean) => ReactNode) }) {
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          setDragging(false);
        }, 50);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        Array.from(files).forEach((file) => {
          uppy.addFile({
            data: file,
          })
        });
        setDragging(false);
      }}>
      {typeof children === 'function' ? children(dragging) : children}
    </div>
  )
}