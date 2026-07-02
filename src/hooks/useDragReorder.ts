import { useState } from "react";

export function useDragReorder<T>(setItems: (updater: (arr: T[]) => T[]) => void) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    setItems((s) => {
      if (to < 0 || to >= s.length || from === to) return s;
      const next = s.slice();
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const handleProps = (idx: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragIdx(idx);
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", String(idx));
      } catch {}
    },
    onDragEnd: () => setDragIdx(null),
  });

  const dropProps = (idx: number) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragIdx !== null) move(dragIdx, idx);
      setDragIdx(null);
    },
  });

  return { dragIdx, move, handleProps, dropProps };
}
