// Client-side Cloudinary utilities
// This avoids the fs module issue by not importing the full Cloudinary SDK

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxpdn6xgr';

// Helper function to build Cloudinary URL manually
export function getCloudinaryImageUrl(
  publicId: string,
  transformations: Record<string, any> = {}
) {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  };

  // Build transformation string with proper Cloudinary format
  const transformString = Object.entries(defaultTransformations)
    .map(([key, value]) => {
      // Map our keys to Cloudinary's short format
      const keyMap: Record<string, string> = {
        'quality': 'q',
        'fetch_format': 'f',
        'width': 'w',
        'height': 'h',
        'crop': 'c',
        'pg': 'pg',
      };
      const shortKey = keyMap[key] || key;
      return `${shortKey}_${value}`;
    })
    .join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

// Helper function for responsive images
export function getResponsiveImageUrl(
  publicId: string,
  width: number,
  height?: number
) {
  const transformations: Record<string, any> = {
    width,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  };

  if (height) {
    transformations.height = height;
  }

  return getCloudinaryImageUrl(publicId, transformations);
}
