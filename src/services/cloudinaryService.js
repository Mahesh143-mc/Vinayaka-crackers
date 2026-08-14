// Cloudinary Service for Karuppan Crackers
// Cloud Name: vf0fqhwo
// Target Folder: Karuppan Crackers/admin

export const uploadToCloudinary = async (file, folderPath = 'Karuppan Crackers/admin') => {
  if (!file) return null;

  // Try direct Cloudinary upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'karuppancrackers'); 
    formData.append('folder', folderPath);

    const res = await fetch(`https://api.cloudinary.com/v1_1/vf0fqhwo/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        console.log(`Uploaded image to Cloudinary (${folderPath}):`, data.secure_url);
        return data.secure_url;
      }
    }
  } catch (err) {
    console.warn("Cloudinary upload fallback triggered.");
  }

  // Instant DataURL fallback preview (works offline and without server preset)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};
