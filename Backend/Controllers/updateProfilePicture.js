import cloudinary from "../Config/cloudinary.js";
import User from "../models/User.js";

// Update Profile Picture Controller
export const updateProfilePicture = async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if a file is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    // Upload image to Cloudinary in the 'profile_pictures' folder
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    // Extract the Cloudinary public ID
    const cloudinaryId = uploadResult.public_id;

    // Update the user's profilePicture field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: cloudinaryId },
      { new: true } // Returns the updated document
    );

    // Check if the user exists
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile picture",
      error: error.message,
    });
  }
};
