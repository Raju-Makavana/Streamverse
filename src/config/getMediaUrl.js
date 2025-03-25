import { getEnvConfig } from "./envConfig";

export const getMediaUrl = (media, type = 'image') => {
    try {
      const backendURI = getEnvConfig.get("backendURI");
      switch(type) {
        case 'video': 
        if (!media?.resolutions) return null;
        
        const videoUrls = {};
        Object.entries(media.resolutions).forEach(([key, path]) => {
          const normalizedPath = path.startsWith('/') ? path : `/${path}`;
          videoUrls[key] = `${backendURI}/public${normalizedPath}`;
        });
        return videoUrls;
          
        case 'poster':
          return `${backendURI}/public${media}`;
          
        case 'image':
        default:
          if (!media?.image) return "/placeholder-image.jpg";
          const imagePath = media.image.replace(/^uploads\/slider\//, '');
          return `${backendURI}/public/uploads/slider/${imagePath}`;
      }
    } catch (error) {
      console.error("Error constructing media URL:", error);
      return type === 'video' ? null : "/placeholder-image.jpg";    
    }
  };