import { Request, Response } from "express";
import { Types } from "mongoose";

import { testimonialService } from "./testimonial.service";

const parseBody = (body: any) => {
  if (typeof body.data === "string") {
    try {
      return JSON.parse(body.data);
    } catch {
      throw new Error(
        "Invalid JSON format in data field"
      );
    }
  }

  return body;
};

const createTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = parseBody(req.body);

    const avatarFile =
      req.file;

    const testimonial =
      await testimonialService.createTestimonial(
        payload,
        avatarFile
      );

    res.status(201).json({
      success: true,
      message:
        "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create testimonial",
    });
  }
};

const getAllTestimonials = async (
  _req: Request,
  res: Response
) => {
  try {
    const testimonials =
      await testimonialService.getAllTestimonials();

    res.status(200).json({
      success: true,
      message:
        "Testimonials retrieved successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve testimonials",
    });
  }
};

const getActiveTestimonials = async (
  _req: Request,
  res: Response
) => {
  try {
    const testimonials =
      await testimonialService.getActiveTestimonials();

    res.status(200).json({
      success: true,
      message:
        "Active testimonials retrieved successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve active testimonials",
    });
  }
};

const getFeaturedTestimonials = async (
  _req: Request,
  res: Response
) => {
  try {
    const testimonials =
      await testimonialService.getFeaturedTestimonials();

    res.status(200).json({
      success: true,
      message:
        "Featured testimonials retrieved successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve featured testimonials",
    });
  }
};

const getTestimonialById = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid testimonial ID"
      );
    }

    const testimonial =
      await testimonialService.getTestimonialById(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message:
        "Testimonial retrieved successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve testimonial",
    });
  }
};

const updateTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid testimonial ID"
      );
    }

    const payload = parseBody(req.body);

    const avatarFile =
      req.file;

    const testimonial =
      await testimonialService.updateTestimonial(
        req.params.id as string,
        payload,
        avatarFile
      );

    res.status(200).json({
      success: true,
      message:
        "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update testimonial",
    });
  }
};

const deleteTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid testimonial ID"
      );
    }

    const testimonial =
      await testimonialService.deleteTestimonial(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message:
        "Testimonial deleted successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete testimonial",
    });
  }
};

export const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  getActiveTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};