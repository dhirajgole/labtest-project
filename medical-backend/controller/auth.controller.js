const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const {
  findUserByEmail,
  findUserByUsername,
  findUserByEmailOrUsername,
  createUser,
  saveResetToken,
  findValidResetToken,
  markResetTokenUsed,
  updateUserPassword
} = require('../models/auth.model');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registerUser = async (req, res) => {
  try {
    const { fname, mname, lname, gender, dob, email, mobile, username, password } = req.body;

    if (!fname || !lname || !email || !mobile || !username || !password) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await createUser({
      fname,
      mname,
      lname,
      gender,
      dob,
      email,
      mobile,
      username,
      password_hash
    });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password required' });
    }

    const user = await findUserByEmailOrUsername(identifier);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        gender: user.gender,
        dob: user.dob,
        email: user.email,
        mobile: user.mobile,
        username: user.username,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await saveResetToken(user.id, resetToken, expiresAt);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - MediCare Hub',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `
    });

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset link', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const resetEntry = await findValidResetToken(token);

    if (!resetEntry) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await updateUserPassword(resetEntry.user_id, password_hash);
    await markResetTokenUsed(resetEntry.id);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};