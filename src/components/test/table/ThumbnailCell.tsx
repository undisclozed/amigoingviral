import React from "react";
import { TableCell } from "@/components/ui/table";

interface ThumbnailCellProps {
  reel: any;
}

export const ThumbnailCell = ({ reel }: ThumbnailCellProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    console.error('Image failed to load:', {
      attemptedSrc: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      error: e
    });
    img.src = '/placeholder.svg';
  };

  const getThumbnailUrl = (reel: any) => {
    const proxyUrl = 'https://images.weserv.nl/?url=';
    const originalUrl = encodeURIComponent(reel.thumbnail_url || reel.display_url || '/placeholder.svg');
    
    console.log('Original URL:', originalUrl);
    return originalUrl.includes('placeholder.svg') ? '/placeholder.svg' : `${proxyUrl}${originalUrl}`;
  };

  return (
    <TableCell>
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={getThumbnailUrl(reel)}
            alt="Reel thumbnail"
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      </div>
    </TableCell>
  );
};