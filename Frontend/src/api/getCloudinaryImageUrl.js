export const getCloudinaryImageUrl = (publicId, format = "jpg") => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.${format}`;
};
