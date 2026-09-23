import { Types } from "mongoose";
import {
  ContactStatus,
  ICreateContactPayload,
  IUpdateContactPayload,
} from "./contact.interface";
import { ContactModel } from "./contact.model";

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
  });

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

  const contacts = await ContactModel.find(filter).sort({
    createdAt: -1,
  });

  return contacts;
};

const getContactById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  const contact = await ContactModel.findById(id);

  if (!contact) {
    throw new Error("Contact message not found");
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

    if (!allowedStatuses.includes(payload.status)) {
      throw new Error("Invalid contact status");
    }
  }

  const contact = await ContactModel.findByIdAndUpdate(
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
    throw new Error("Contact message not found");
  }

  return contact;
};

const deleteContact = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID");
  }

  const contact = await ContactModel.findByIdAndDelete(id);

  if (!contact) {
    throw new Error("Contact message not found");
  }

  return contact;
};

export const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};