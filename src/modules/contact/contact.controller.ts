import { Request, Response } from "express";
import {
  ContactStatus,
  ICreateContactPayload,
  IUpdateContactPayload,
} from "./contact.interface";
import { contactService } from "./contact.service";

const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as ICreateContactPayload;

    const contact = await contactService.createContact(
      payload
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send message",
    });
  }
};

const getAllContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status as
      | ContactStatus
      | undefined;

    const contacts =
      await contactService.getAllContacts(status);

    res.status(200).json({
      success: true,
      message: "Contact messages retrieved successfully",
      data: contacts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve contact messages",
    });
  }
};

const getContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact =
      await contactService.getContactById(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Contact message retrieved successfully",
      data: contact,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Contact message not found",
    });
  }
};

const updateContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = req.body as IUpdateContactPayload;

    const contact =
      await contactService.updateContact(
        req.params.id as string,
        payload
      );

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update contact",
    });
  }
};

const deleteContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await contactService.deleteContact(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete contact",
    });
  }
};

export const contactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};