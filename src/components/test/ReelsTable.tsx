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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnails (Testing)</TableHead>
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
              <div className="grid grid-cols-2 gap-2">
                {/* Approach 1: Direct thumbnail_url with img tag */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={reel.thumbnail_url || '/placeholder.svg'}
                    alt="Approach 1: Direct thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>

                {/* Approach 2: Using display_url with crossOrigin and referrerPolicy */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={reel.display_url || '/placeholder.svg'}
                    alt="Approach 2: Display URL"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Approach 3: Using background-image CSS */}
                <div 
                  className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${reel.thumbnail_url || '/placeholder.svg'})`,
                    backgroundColor: '#f3f4f6' 
                  }}
                />

                {/* Approach 4: Using picture element with multiple sources */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <picture>
                    <source srcSet={reel.display_url} type="image/jpeg" />
                    <source srcSet={reel.thumbnail_url} type="image/jpeg" />
                    <img 
                      src={'/placeholder.svg'}
                      alt="Approach 4: Picture element"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </picture>
                </div>
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
