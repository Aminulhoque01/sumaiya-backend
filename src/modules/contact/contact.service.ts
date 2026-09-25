import { Types } from "mongoose";

import {
  ContactStatus,
  ICreateContactPayload,
  IReplyContactPayload,
  IUpdateContactPayload,
} from "./contact.interface";

import { ContactModel } from "./contact.model";
import { emailService } from "../service/email.service";

 
const createContact = async (
  payload: ICreateContactPayload
) => {
  const contact = await ContactModel.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    subject: payload.subject,
    message: payload.message,
    status: "NEW",
    replies: [],
  });

  /*
   * Send notification to admin.
   *
   * Important:
   * Contact is already saved in MongoDB.
   * So even if email notification fails,
   * visitor's message will not be lost.
   */
  try {
    await emailService.sendNewContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
    });
  } catch (error) {
    console.error(
      "Failed to send new contact notification:",
      error
    );
  }

  return contact;
};

const getAllContacts = async (
  status?: ContactStatus
) => {
  const filter: {
    status?: ContactStatus;
  } = {};

  if (status) {
    filter.status = status;
  }

  const contacts = await ContactModel.find(
    filter
  ).sort({
    createdAt: -1,
  });

  return contacts;
};

const getContactById = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  const contact =
    await ContactModel.findById(id);

  if (!contact) {
    throw new Error(
      "Contact message not found"
    );
  }

  return contact;
};

const updateContact = async (
  id: string,
  payload: IUpdateContactPayload
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  if (payload.status) {
    const allowedStatuses: ContactStatus[] = [
      "NEW",
      "READ",
      "REPLIED",
      "ARCHIVED",
    ];

    if (
      !allowedStatuses.includes(
        payload.status
      )
    ) {
      throw new Error(
        "Invalid contact status"
      );
    }
  }

  const contact =
    await ContactModel.findByIdAndUpdate(
      id,
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!contact) {
    throw new Error(
      "Contact message not found"
    );
  }

  return contact;
};

const replyToContact = async (
  id: string,
  payload: IReplyContactPayload
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  const message =
    payload.message?.trim();

  if (!message) {
    throw new Error(
      "Reply message is required"
    );
  }

  if (message.length > 10000) {
    throw new Error(
      "Reply message cannot exceed 10000 characters"
    );
  }

  const contact =
    await ContactModel.findById(id);

  if (!contact) {
    throw new Error(
      "Contact message not found"
    );
  }

  /*
   * Build reply subject.
   */
  const originalSubject =
    contact.subject?.trim();

  let replySubject = "Re: Your message";

  if (originalSubject) {
    replySubject =
      /^re:/i.test(originalSubject)
        ? originalSubject
        : `Re: ${originalSubject}`;
  }

  /*
   * Send email first.
   *
   * We only save reply history after
   * successful email delivery to SMTP.
   */
  const emailResult =
    await emailService.sendContactReply({
      to: contact.email,
      subject: replySubject,
      message,
    });

  /*
   * Save reply history.
   */
  contact.replies.push({
    message,
    sentAt: new Date(),
    messageId:
      emailResult.messageId,
  });

  contact.status = "REPLIED";

  await contact.save();

  return contact;
};

const deleteContact = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  const contact =
    await ContactModel.findByIdAndDelete(id);

  if (!contact) {
    throw new Error(
      "Contact message not found"
    );
  }

  return contact;
};

export const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  replyToContact,
  deleteContact,
};