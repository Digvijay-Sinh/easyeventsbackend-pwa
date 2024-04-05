import { Request, Response } from "express";
import { EventModel } from "../models/eventModel";
import { ImageModel } from "../models/posterImageModel";
import { CustomRequest } from "../middleware/middleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const eventModel = new EventModel();
const imageModel = new ImageModel();

export interface SearchFilters {
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export class EventController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const events = await eventModel.findAll();
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async search(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.search as string; // Retrieve the search parameter from the request query
      const filters: SearchFilters = {
        category: req.query.category as string,
        type: req.query.type as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
   
      console.log(filters);

      const events = await eventModel.search(searchTerm, filters);
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async paginated(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1; // Get page number from query parameter or default to 1
      const pageSize = 4; // Number of items per page
      const totalCount = await prisma.event.count();

      const data = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: true,
          category: true, // Include the category information
          type: true, // Include the type information
        },
      });

      res.json({ data, totalCount: Math.ceil(totalCount/4) });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async findAllInDetail(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      console.log("==============eventController.ts===========");
      console.log(eventId);

      const events = await eventModel.findAllInDetail(eventId);
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async getUserEventsDetails(req: CustomRequest, res: Response): Promise<void> {
    try {
      const userId = req?.user as string;
      console.log("==============eventController.ts===========");
      console.log(userId);

      const events = await eventModel.getUserEventsDetails(parseInt(userId));
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async getUserEventsDetailsHostedEvents(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req?.user as string;
      console.log("==============eventController.ts===========");
      console.log(userId);
      const eventId = Number(req.params.id);
      const events = await eventModel.getUserEventsDetailsHostedEvents(
        eventId,
        parseInt(userId)
      );
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      console.log("==============create event model===========");
      console.log(req.body);
      console.log("====================================");
      const newEvent = await eventModel.create({
        ...req.body,
        organizer_id: req?.user as string,
        tickets_remaining: req.body.capacity,
      });
      res.json({
        error: false,
        message: "Event added successfully!",
        data: newEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async updateBasicDetail(req: CustomRequest, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);

      console.log("==============create event model===========");
      console.log(req.body);
      console.log("====================================");
      const newEvent = await eventModel.updateBasicDetail(eventId, {
        ...req.body,
        organizer_id: req?.user as string,
        tickets_remaining: req.body.capacity,

      });
      res.json({
        error: false,
        message: "Event updated successfully!",
        data: newEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async deleteEvent(req: CustomRequest, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);

      console.log("==============create event model===========");
      console.log(req.body);
      console.log("====================================");
      const newEvent = await eventModel.deleteEvent(eventId, {
        organizer_id: req?.user as string,
      });
      if (!newEvent) {
        res.status(500).json({
          error: true,
          message:
            "Cannot delete event ! Because already some seats are booked!",
        });
        return;
      }
      res.json({
        error: false,
        message: "Event deleted successfully!",
        data: newEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const event = await eventModel.findById(eventId);
      if (!event) {
        res.status(404).json({ error: true, message: "Event not found" });
        return;
      }
      res.json(event);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const updatedEvent = await eventModel.update(eventId, req.body);
      res.json({
        error: false,
        message: "Event successfully updated",
        data: updatedEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      await eventModel.remove(eventId);
      res.json({ error: false, message: "Event successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
