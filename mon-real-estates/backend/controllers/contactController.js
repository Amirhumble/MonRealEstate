import { Contact } from "../models/contact.js";
import nodemailer from "nodemailer";

const makeTransporter = () => {
  const { EMAIL_USER, EMAIL_APP_PASSWORD } = process.env;
  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    throw new Error('Missing email credentials. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD
    }
  });
};

// Create new contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    const transporter = makeTransporter();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: 'New Contact Message from MonRealEstate',
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    let emailSent = true;
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      emailSent = false;
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ contact, emailSent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

