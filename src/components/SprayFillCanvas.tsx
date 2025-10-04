"use client";
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";

type ClipKind = "rect" | "text" | "path";

export type SprayFillHandle = {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSweepDirection: (dir: "ltr" | "rtl") => void;
};

export type SprayFillProps = {
  width?: number;
  height?: number;
  color?: string;
  background?: string;
  flowRate?: number;         // droplets per second
  nozzleRadius?: number;     // sigma (px) for radial distribution
  dropletMean?: number;      // px
  dropletSigma?: number;     // px
  dropletMin?: number;       // px
  dropletMax?: number;       // px
  alphaMin?: number;         // 0..1 (deprecated - now uses solid dots)
  alphaMax?: number;         // 0..1 (deprecated - now uses solid dots)
  sweepSpeed?: number;       // px/sec
  loop?: boolean;
  clipKind?: ClipKind;
  textOptions?: {
    text: string;
    font: string; // e.g., "bold 160px Inter, system-ui, sans-serif"
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
  };
  buildPath?: (w: number, h: number) => Path2D; // for clipKind="path"
  seed?: number; // for deterministic runs (optional)
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeSeededRng(seed = 123456) {
  // xorshift32
  let s = seed | 0;
  if (s === 0) s = 123456789;
  return function rng() {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    // map to [0,1)
    return ((s >>> 0) / 0xffffffff);
  };
}

// Box–Muller transform: returns ~N(0,1)
function gaussian01(rand: () => number) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const SprayFillCanvas = forwardRef<SprayFillHandle, SprayFillProps>(function SprayFillCanvas(
  {
    width = 900,
    height = 300,
    color = "#0a0a0a",
    background = "transparent",
    flowRate = 2500,
    nozzleRadius = 12,
    dropletMean = 1.6,
    dropletSigma = 0.6,
    dropletMin = 0.6,
    dropletMax = 3.0,
    alphaMin = 0.04,
    alphaMax = 0.12,
    sweepSpeed = 220,
    loop = false,
    clipKind = "rect",
    textOptions,
    buildPath,
    seed = 1337,
    className,
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(false);
  const directionRef = useRef<"ltr" | "rtl">("ltr");
  const tPrevRef = useRef<number | null>(null);

  // nozzle position state
  const nozzleXRef = useRef<number>(0);
  const nozzleYRef = useRef<number>(0);

  // seeded RNG
  const rng = useMemo(() => makeSeededRng(seed), [seed]);

  // prepare text/path clip
  const buildClipPath = React.useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const path = new Path2D();
    if (clipKind === "text" && textOptions?.text && textOptions?.font) {
      ctx.save();
      ctx.font = textOptions.font;
      ctx.textAlign = textOptions.align ?? "center";
      ctx.textBaseline = textOptions.baseline ?? "middle";
      ctx.restore();
      return path; // empty; mask handled separately
    } else if (clipKind === "path" && buildPath) {
      return buildPath(w, h);
    } else {
      // default rect - full canvas fill
      path.rect(0, 0, w, h);
      return path;
    }
  }, [clipKind, textOptions, buildPath]);

  // offscreen mask for text clip
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const resizeAndInit = React.useCallback(() => {
    const canvas = canvasRef.current!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssW = width;
    const cssH = height;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // clear + bg
    ctx.save();
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.restore();

    // init nozzle position
    nozzleYRef.current = cssH * 0.5;
    nozzleXRef.current = directionRef.current === "ltr" ? 0 : cssW;

    // build/resize mask canvas for text clip
    if (!maskCanvasRef.current) {
      maskCanvasRef.current = document.createElement("canvas");
    }
    const m = maskCanvasRef.current;
    m.width = canvas.width;
    m.height = canvas.height;
    const mctx = m.getContext("2d")!;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, cssW, cssH);

    if (clipKind === "text" && textOptions?.text && textOptions?.font) {
      mctx.save();
      mctx.fillStyle = "#000";
      mctx.font = textOptions.font;
      mctx.textAlign = textOptions.align ?? "center";
      mctx.textBaseline = textOptions.baseline ?? "middle";
      mctx.fillText(textOptions.text, cssW / 2, cssH / 2);
      mctx.restore();
    } else {
      // draw path to mask
      const path = buildClipPath(ctx, cssW, cssH);
      mctx.save();
      mctx.fillStyle = "#000";
      mctx.fill(path);
      mctx.restore();
    }
  }, [width, height, background, clipKind, textOptions, buildPath, buildClipPath]);

  const step = (tNow: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (tPrevRef.current == null) tPrevRef.current = tNow;
    const dt = Math.min(0.05, (tNow - tPrevRef.current) / 1000); // clamp dt
    tPrevRef.current = tNow;

    // advance nozzle
    const dir = directionRef.current === "ltr" ? 1 : -1;
    nozzleXRef.current += dir * (sweepSpeed * dt);

    // stop/loop logic
    if (directionRef.current === "ltr" && nozzleXRef.current >= w) {
      if (loop) {
        directionRef.current = "rtl";
        nozzleXRef.current = w;
      } else runningRef.current = false;
    } else if (directionRef.current === "rtl" && nozzleXRef.current <= 0) {
      if (loop) {
        directionRef.current = "ltr";
        nozzleXRef.current = 0;
      } else runningRef.current = false;
    }

    // spray batch
    const dropletsTarget = flowRate * dt;
    const droplets = Math.min(5000, Math.floor(dropletsTarget)); // Higher cap for scattered dots

    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 1.0; // Solid dots

    for (let i = 0; i < droplets; i++) {
      // Horizontal position with MORE spread for scattered look
      const xSpread = gaussian01(rng) * nozzleRadius * 2.0; // Double spread for sporadic placement
      const x = nozzleXRef.current + xSpread;

      // Decide if this is a small scattered dot or main fill dot
      const isScatteredDot = rng() < 0.45; // 45% are scattered small dots
      
      let y;
      let normalizedDistance;
      
      if (isScatteredDot) {
        // Scattered small dots - more random placement across height
        const randY = rng();
        y = randY * h;
        const distanceFromCenter = Math.abs(y - h / 2);
        normalizedDistance = distanceFromCenter / (h / 2);
      } else {
        // Main fill dots - center-biased but with MORE randomness
        const rand = rng();
        const spreadFactor = Math.pow(rand, 3.0); // Less extreme = more spread
        const direction = rng() < 0.5 ? -1 : 1;
        // Add significant random jitter for sporadic look
        const jitter = (rng() - 0.5) * h * 0.2; // ±20% height jitter
        y = (h / 2) + direction * (h / 2) * spreadFactor * 0.75 + jitter;
        
        // Clamp to bounds
        y = Math.max(0, Math.min(h, y));
        const distanceFromCenter = Math.abs(y - h / 2);
        normalizedDistance = distanceFromCenter / (h / 2);
      }
      
      // More lenient culling for scattered sporadic look
      const densityFalloff = Math.pow(1 - normalizedDistance, 2.2); // Much less steep
      const shouldDraw = rng() < (0.2 + densityFalloff * 0.8); // 20% chance even at edges
      
      if (!shouldDraw) {
        continue;
      }
      
      // Size varies dramatically - MANY small dots
      let sizeMultiplier;
      if (isScatteredDot) {
        // Scattered dots are VERY SMALL
        sizeMultiplier = 0.08 + rng() * 0.25; // 8-33% of base size
      } else {
        // Main fill dots with gradient
        const sizeReduction = Math.pow(1 - normalizedDistance, 1.6);
        sizeMultiplier = 0.25 + (sizeReduction * 0.95); // Range from 25% to 120%
      }
      
      // Base droplet size with natural variation
      const baseRad = clamp(
        dropletMean + gaussian01(rng) * dropletSigma,
        dropletMin,
        dropletMax
      );
      
      // Apply ombre gradient multiplier
      let rad = baseRad * sizeMultiplier;
      
      // Add slight random variation to avoid banding
      rad *= (0.9 + rng() * 0.2);
      
      // Enforce minimum size
      rad = Math.max(rad, 0.25);

      // draw circle
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // apply mask (destination-in keeps only overlapped with mask)
    if (maskCanvasRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskCanvasRef.current, 0, 0, canvas.width, canvas.height, 0, 0, w, h);
      ctx.restore();
    }

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    resizeAndInit();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [resizeAndInit]);

  // Disable resize handler to prevent canvas clearing on mobile scroll
  // The canvas width is controlled by parent component state
  // useEffect(() => {
  //   const onResize = () => {
  //     resizeAndInit();
  //   };
  //   window.addEventListener("resize", onResize);
  //   return () => window.removeEventListener("resize", onResize);
  // }, [resizeAndInit]);

  // Imperative API
  useImperativeHandle(ref, () => ({
    start() {
      if (runningRef.current) return;
      runningRef.current = true;
      tPrevRef.current = null;
      rafRef.current = requestAnimationFrame(step);
    },
    pause() {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    reset() {
      const c = canvasRef.current!;
      const ctx = c.getContext("2d")!;
      const w = c.clientWidth;
      const h = c.clientHeight;
      // clear to background + reapply mask base
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // reset DPR transform after clear
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "transparent";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      // reset nozzle
      directionRef.current = "ltr";
      nozzleXRef.current = 0;
      nozzleYRef.current = h * 0.5;
      tPrevRef.current = null;
    },
    setSweepDirection(dir) {
      directionRef.current = dir;
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width, height }}
    />
  );
});

export default SprayFillCanvas;

