import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SignPad({
  name,
  onDone,
}: {
  name: string;
  onDone: (dataUrl: string, kind: "draw" | "type" | "upload") => void;
}) {
  const [tab, setTab] = useState<"draw" | "type" | "upload">("draw");
  const [typed, setTyped] = useState(name);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "#1b2430";
  }, [tab]);

  function pos(e: React.PointerEvent) {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function clear() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  }

  function commitDraw() {
    const c = canvasRef.current;
    if (!c) return;
    onDone(c.toDataURL("image/png"), "draw");
  }

  function commitType() {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 180;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, 640, 180);
    ctx.fillStyle = "#1b2430";
    ctx.font = "72px 'Great Vibes', cursive";
    ctx.textBaseline = "middle";
    ctx.fillText(typed || name, 24, 100);
    onDone(c.toDataURL("image/png"), "type");
  }

  return (
    <div>
      <div className="mb-3 flex gap-1 rounded-md bg-surface-2 p-1">
        {(["draw", "type", "upload"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 rounded-sm py-1.5 text-xs font-medium",
              tab === k ? "bg-surface text-ink shadow-sm" : "text-muted",
            )}
          >
            {k === "draw" ? "Gambar" : k === "type" ? "Ketik" : "Unggah"}
          </button>
        ))}
      </div>
      {tab === "draw" ? (
        <div>
          <canvas
            ref={canvasRef}
            className="h-36 w-full cursor-crosshair rounded-md border border-border bg-paper"
            onPointerDown={(e) => {
              drawing.current = true;
              const ctx = canvasRef.current?.getContext("2d");
              const p = pos(e);
              ctx?.beginPath();
              ctx?.moveTo(p.x, p.y);
              (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              const ctx = canvasRef.current?.getContext("2d");
              const p = pos(e);
              ctx?.lineTo(p.x, p.y);
              ctx?.stroke();
            }}
            onPointerUp={() => {
              drawing.current = false;
            }}
          />
          <div className="mt-3 flex justify-between">
            <Button variant="ghost" size="sm" type="button" onClick={clear}>
              Hapus
            </Button>
            <Button size="sm" type="button" onClick={commitDraw}>
              Gunakan tanda tangan
            </Button>
          </div>
        </div>
      ) : null}
      {tab === "type" ? (
        <div>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} />
          <div className="sign-font mt-3 flex h-28 items-center justify-center rounded-md border border-border bg-paper text-4xl">
            {typed || name}
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" type="button" onClick={commitType}>
              Gunakan tanda tangan
            </Button>
          </div>
        </div>
      ) : null}
      {tab === "upload" ? (
        <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-paper text-sm text-muted">
          Pilih gambar PNG / JPG
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => onDone(String(reader.result), "upload");
              reader.readAsDataURL(f);
            }}
          />
        </label>
      ) : null}
    </div>
  );
}
