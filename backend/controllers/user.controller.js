import User from '../models/User.js';
import { deleteImage } from '../middleware/upload.middleware.js';
import { sendEmail } from '../services/email.service.js';

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phoneNumber },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      const oldKey = user.avatar.split('/').pop();
      await deleteImage(`avatars/${oldKey}`);
    }

    user.avatar = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const mailOptions = {
      to: email,
      subject: 'Welcome to our Newsletter!',
      text: `Thank you for subscribing to our newsletter! Stay tuned for the latest updates.`,
      html: `
      <p>Thank you for subscribing to our newsletter! Stay tuned for the latest updates.</p>
      <hr>
      <p style="font-size: 0.9em; color: #888;">This is a testing email for a project. Please do not reply to this email.</p>
      `,
    };

    await sendEmail(mailOptions)
    res.json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}