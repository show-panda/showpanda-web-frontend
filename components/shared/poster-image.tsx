"use client";

import { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

type PosterImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function PosterImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
}: PosterImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = src?.trim();
  const usableUrl = url && (/^https?:\/\//i.test(url) || (url.startsWith("/") && !url.startsWith("//")));

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {usableUrl && failedUrl !== url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          onError={() => setFailedUrl(url)}
          className={imageClassName}
        />
      ) : (
        <div role="img" aria-label={`${alt} unavailable`} className="grid h-full w-full place-items-center text-muted-foreground">
          <Film className="size-8" aria-hidden />
        </div>
      )}
    </div>
  );
}
