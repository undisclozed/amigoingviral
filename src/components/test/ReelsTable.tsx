import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ReelsTableProps {
  data: any[];
}

export const ReelsTable = ({ data }: ReelsTableProps) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnail Debug</TableHead>
          <TableHead>Raw URLs</TableHead>
          <TableHead>Caption</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Posted</TableHead>
          <TableHead className="text-right">Duration</TableHead>
          <TableHead className="text-right">Comments</TableHead>
          <TableHead className="text-right">Likes</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Saves</TableHead>
          <TableHead>Hashtags</TableHead>
          <TableHead>Mentions</TableHead>
          <TableHead>Music</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Sponsored</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((reel: any) => {
          // Log all URL-related fields for debugging
          console.log('Reel data:', {
            id: reel.reel_id,
            thumbnail_url: reel.thumbnail_url,
            display_url: reel.display_url,
            url: reel.url
          });

          return (
            <TableRow key={reel.reel_id}>
              <TableCell>
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={reel.thumbnail_url || reel.display_url || '/placeholder.svg'}
                    alt="Reel thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="space-y-1 text-xs">
                  <p><strong>thumbnail_url:</strong> {reel.thumbnail_url || 'N/A'}</p>
                  <p><strong>display_url:</strong> {reel.display_url || 'N/A'}</p>
                  <p><strong>url:</strong> {reel.url || 'N/A'}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="line-clamp-2">{reel.caption}</p>
              </TableCell>
              <TableCell>
                <a 
                  href={reel.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Post
                </a>
              </TableCell>
              <TableCell>{formatDate(reel.timestamp)}</TableCell>
              <TableCell className="text-right">
                {reel.video_duration ? formatDuration(reel.video_duration) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">{reel.comments_count?.toLocaleString()}</TableCell>
              <TableCell className="text-right">{reel.likes_count?.toLocaleString()}</TableCell>
              <TableCell className="text-right">{reel.views_count?.toLocaleString()}</TableCell>
              <TableCell className="text-right">{reel.shares_count?.toLocaleString()}</TableCell>
              <TableCell className="text-right">{reel.saves_count?.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {reel.hashtags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {reel.mentions?.map((mention: string, index: number) => (
                    <Badge key={index} variant="outline">@{mention}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{reel.music_info?.title || 'N/A'}</TableCell>
              <TableCell>{reel.location_info?.name || 'N/A'}</TableCell>
              <TableCell>{reel.is_sponsored ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};