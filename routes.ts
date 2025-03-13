import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.message });
      return;
    }

    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.post("/api/tasks/:id/toggle", async (req, res) => {
    try {
      const task = await storage.toggleTask(Number(req.params.id));
      res.json(task);
    } catch (error) {
      res.status(404).json({ message: "Task not found" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(404).json({ message: "Task not found" });
    }
  });

  return createServer(app);
}
