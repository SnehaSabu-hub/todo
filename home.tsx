import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { assignEmoji } from "@/lib/emoji";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTask = useMutation({
    mutationFn: async (content: string) => {
      const emoji = assignEmoji(content);
      await apiRequest("POST", "/api/tasks", { content, emoji });
    },
    onSuccess: () => {
      setNewTask("");
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ description: "Task created successfully!" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to create task",
      });
    },
  });

  const toggleTask = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/tasks/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ description: "Task deleted successfully!" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      createTask.mutate(newTask.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Tasks & Todos
          </h1>
          <p className="text-muted-foreground">
            Add tasks and watch them come alive with emojis! ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1"
          />
          <Button type="submit" disabled={createTask.isPending}>
            Add Task
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card className="p-4 flex items-center gap-4 group">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask.mutate(task.id)}
                    />
                    <span className="text-2xl">{task.emoji}</span>
                    <span
                      className={`flex-1 ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.content}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask.mutate(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
