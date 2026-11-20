"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

type Phase = "loading" | "loaded" | "ready" | "error";

function useSkeleton(srcKey: string) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) {
      setPhase(img.naturalWidth > 0 ? "ready" : "error");
    } else {
      setPhase("loading");
    }
  }, [srcKey]);

  return {
    ref,
    phase,
    handleLoad: () => setPhase("loaded"),
    handleError: () => setPhase("error"),
  };
}

export default function SkeletonImage({ onLoad, onError, ...props }: ImageProps) {
  const { src } = props;
  const srcKey = typeof src === "string" ? src : "default" in src ? src.default.src : src.src;
  const { ref, phase, handleLoad, handleError } = useSkeleton(srcKey);

  return (
    <Image
      {...props}
      ref={ref}
      data-skeleton={phase}
      onLoad={(e) => {
        handleLoad();
        onLoad?.(e);
      }}
      onError={(e) => {
        handleError();
        onError?.(e);
      }}
    />
  );
}

export function SkeletonImg({
  onLoad,
  onError,
  alt,
  ...props
}: React.ComponentPropsWithoutRef<"img"> & { alt: string }) {
  const { ref, phase, handleLoad, handleError } = useSkeleton(String(props.src ?? ""));

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      ref={ref}
      data-skeleton={phase}
      onLoad={(e) => {
        handleLoad();
        onLoad?.(e);
      }}
      onError={(e) => {
        handleError();
        onError?.(e);
      }}
    />
  );
}
