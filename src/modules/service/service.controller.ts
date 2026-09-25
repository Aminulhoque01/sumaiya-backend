import { Request, Response } from "express";
import { Types } from "mongoose";

import { serviceService } from "./service.service";

const parsePayload = (data: unknown) => {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("Invalid JSON data in request");
  }
};

const getRequestPayload = (req: Request) => {
  /**
   * Supports both:
   *
   * 1. JSON body
   * {
   *   title: "...",
   *   slug: "..."
   * }
   *
   * 2. Multipart form-data
   * data: JSON.stringify({...})
   */

  const rawPayload =
    req.body?.data !== undefined
      ? req.body.data
      : req.body;

  const payload = parsePayload(rawPayload);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    throw new Error("Invalid service payload");
  }

  return payload;
};

const createService = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = getRequestPayload(req);

    const imageFile = req.file;

    const service =
      await serviceService.createService(
        payload,
        imageFile
      );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create service",
    });
  }
};

const getAllServices = async (
  _req: Request,
  res: Response
) => {
  try {
    const services =
      await serviceService.getAllServices();

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve services",
    });
  }
};

const getActiveServices = async (
  _req: Request,
  res: Response
) => {
  try {
    const services =
      await serviceService.getActiveServices();

    res.status(200).json({
      success: true,
      message:
        "Active services retrieved successfully",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve active services",
    });
  }
};

const getServiceById = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error("Invalid service ID");
    }

    const service =
      await serviceService.getServiceById(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve service",
    });
  }
};

const getServiceBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const service =
      await serviceService.getServiceBySlug(
        req.params.slug as string
      );

    res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Service not found",
    });
  }
};

const updateService = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error("Invalid service ID");
    }

    const payload = getRequestPayload(req);

    const imageFile = req.file;

    const service =
      await serviceService.updateService(
        req.params.id as string,
        payload,
        imageFile
      );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update service",
    });
  }
};

const deleteService = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error("Invalid service ID");
    }

    const service =
      await serviceService.deleteService(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete service",
    });
  }
};

export const serviceController = {
  createService,
  getAllServices,
  getActiveServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
};