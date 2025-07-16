import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';

export const uploadToCloudinary = async (file, folder, resource_type = 'auto') => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type,
  });
  await fs.unlink(file.path); // Delete local file
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};
