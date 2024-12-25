import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <TableHead>Sponsored</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((reel: any) => (
          <TableRow key={reel.reel_id}>
            <TableCell>
              {reel.thumbnail_url && (
                <img 
                  src={reel.thumbnail_url} 
                  alt="Reel thumbnail" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
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
            <TableCell>{reel.is_sponsored ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};