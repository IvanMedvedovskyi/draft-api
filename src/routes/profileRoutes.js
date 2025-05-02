import {
  getProfile,
  getAllProfiles,
  updateProfile,
} from "../controllers/profileController.js";

async function profileRoutes(app, options) {
  app.get("/profile", getProfile);
  app.get("/getAllProfiles", getAllProfiles);
  app.put("/updateProfile", updateProfile);
}

export default profileRoutes;
