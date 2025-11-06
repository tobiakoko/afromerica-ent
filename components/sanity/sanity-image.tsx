"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/cms/sanity";
import type { SanityImage as SanityImageType } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: SanityImageType | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
}: SanityImageProps) {
  if (!image || !image.asset) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-4xl">🎵</span>
      </div>
    );
  }

  const imageUrl = getImageUrl(image, width, height);
  const imageAlt = alt || image.alt || "Image";

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={imageAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
    />
  );
}
