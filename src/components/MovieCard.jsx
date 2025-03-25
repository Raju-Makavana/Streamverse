// src/components/MovieCard.jsx
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function MovieCard({ title, image, rating }) {
  return (
    <Card className="hover:scale-105 transition-transform">
      <CardMedia
        component="img"
        height="240"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {rating}/10
        </Typography>
      </CardContent>
    </Card>
  );
}