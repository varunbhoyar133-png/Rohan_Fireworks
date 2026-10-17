import Setting from '../models/Setting.js';

// @desc    Get store settings (Public / Admin)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: 'store_settings' });

    if (!settings) {
      settings = await Setting.create({ key: 'store_settings' });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: 'store_settings' });

    if (!settings) {
      settings = new Setting({ key: 'store_settings' });
    }

    const {
      storeName,
      tagline,
      logoText,
      currency,
      announcementBar,
      businessInfo,
      promoBanner,
      policies,
      onlineOrdersEnabled,
    } = req.body;

    if (storeName !== undefined) settings.storeName = storeName;
    if (tagline !== undefined) settings.tagline = tagline;
    if (logoText !== undefined) settings.logoText = logoText;
    if (currency !== undefined) settings.currency = currency;
    if (announcementBar !== undefined) settings.announcementBar = { ...settings.announcementBar.toObject(), ...announcementBar };
    if (businessInfo !== undefined) settings.businessInfo = { ...settings.businessInfo.toObject(), ...businessInfo };
    if (promoBanner !== undefined) settings.promoBanner = { ...settings.promoBanner.toObject(), ...promoBanner };
    if (policies !== undefined) settings.policies = { ...settings.policies.toObject(), ...policies };
    if (onlineOrdersEnabled !== undefined) settings.onlineOrdersEnabled = onlineOrdersEnabled;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully and persisted to database.',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
