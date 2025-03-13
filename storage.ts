import { type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  toggleTask(id: number): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      id,
      ...insertTask,
      completed: false,
    };
    this.tasks.set(id, task);
    return task;
  }

  async toggleTask(id: number): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    const updatedTask = { ...task, completed: !task.completed };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.tasks.delete(id)) {
      throw new Error("Task not found");
    }
  }
}

export const storage = new MemStorage();
