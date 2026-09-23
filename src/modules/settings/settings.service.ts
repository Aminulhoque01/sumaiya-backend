import {
  ISiteSettings,
} from "./settings.interface";

import { SettingsModel } from "./settings.model";

const getSettings = async () => {
  const settings = await SettingsModel.findOne({
    isActive: true,
  }).lean();

  return settings;
};

const getSettingsForAdmin = async () => {
  const settings = await SettingsModel.findOne().lean();

  return settings;
};

const createSettings = async (
  payload: ISiteSettings
) => {
  const existingSettings =
    await SettingsModel.findOne();

  if (existingSettings) {
    throw new Error(
      "Site settings already exist. Please update the existing settings."
    );
  }

  const settings =
    await SettingsModel.create(payload);

  return settings;
};

const updateSettings = async (
  payload: Partial<ISiteSettings>
) => {
  const existingSettings =
    await SettingsModel.findOne();

  if (!existingSettings) {
    throw new Error(
      "Site settings not found. Please create settings first."
    );
  }

  const updatedSettings =
    await SettingsModel.findByIdAndUpdate(
      existingSettings._id,
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  return updatedSettings;
};

const deleteSettings = async () => {
  const settings =
    await SettingsModel.findOne();

  if (!settings) {
    throw new Error(
      "Site settings not found"
    );
  }

  await SettingsModel.findByIdAndDelete(
    settings._id
  );

  return null;
};

const toggleSettings = async (
  isActive: boolean
) => {
  const settings =
    await SettingsModel.findOne();

  if (!settings) {
    throw new Error(
      "Site settings not found"
    );
  }

  settings.isActive = isActive;

  await settings.save();

  return settings;
};

export const settingsService = {
  getSettings,
  getSettingsForAdmin,
  createSettings,
  updateSettings,
  deleteSettings,
  toggleSettings,
};