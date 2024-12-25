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
    const originalSrc = e.currentTarget.src;
    console.error('Image failed to load:', originalSrc);
    e.currentTarget.src = '/placeholder.svg';
  };

  const getThumbnailUrl = (reel: any) => {
    // Log all possible URL fields for debugging
    console.log('Reel data for thumbnails:', {
      thumbnail_url: reel.thumbnail_url,
      display_url: reel.display_url,
      mediaUrl: reel.mediaUrl,
      url: reel.url
    });

    // Try different URL fields in order of preference
    if (reel.thumbnail_url) {
      console.log('Using thumbnail_url:', reel.thumbnail_url);
      return reel.thumbnail_url;
    }
    if (reel.display_url) {
      console.log('Using display_url:', reel.display_url);
      return reel.display_url;
    }

    console.log('No valid thumbnail URL found for reel:', reel.reel_id);
    return '/placeholder.svg';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnail</TableHead>
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
        {data.map((reel: any) => (
          <TableRow key={reel.reel_id}>
            <TableCell>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <img 
                  src={getThumbnailUrl(reel)}
                  alt={`Thumbnail for ${reel.caption?.substring(0, 30) || 'reel'}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
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
        ))}
      </TableBody>
    </Table>
  );
};