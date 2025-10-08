import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Clock, Play, Pause, Check, Edit, Trash2, Plus, X } from 'lucide-react';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';

interface Task {
  id: string;
  title: string;
  description: string;
  timeAllocated: number; // in minutes
  timeRemaining: number; // in seconds
  completed: boolean;
  date: string;
  isRunning: boolean;
}

interface TaskManagementProps {
  onClose: () => void;
}

export const TaskManagement = ({ onClose }: TaskManagementProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', timeAllocated: 30 });
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const { addXP } = useXP();

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('campussynq_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('campussynq_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Timer logic
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === activeTimer && task.isRunning && task.timeRemaining > 0) {
            return { ...task, timeRemaining: task.timeRemaining - 1 };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), i)
  );

  const filteredTasks = tasks.filter(task => 
    isSameDay(new Date(task.date), selectedDate)
  );

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      timeAllocated: newTask.timeAllocated,
      timeRemaining: newTask.timeAllocated * 60,
      completed: false,
      date: selectedDate.toISOString(),
      isRunning: false,
    };

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', timeAllocated: 30 });
    setIsAddingTask(false);
  };

  const handleUpdateTask = (taskId: string) => {
    if (!newTask.title.trim()) return;

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            title: newTask.title, 
            description: newTask.description,
            timeAllocated: newTask.timeAllocated,
            timeRemaining: newTask.timeAllocated * 60
          }
        : task
    ));
    setEditingTask(null);
    setNewTask({ title: '', description: '', timeAllocated: 30 });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTimer === taskId) setActiveTimer(null);
  };

  const handleStartPause = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isRunning: !task.isRunning } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.isRunning) {
      setActiveTimer(taskId);
    } else {
      setActiveTimer(null);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      addXP(XP_ACTIONS.TASK_COMPLETE, 'Task completed!');
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, isRunning: false }
        : task
    ));
    
    if (activeTimer === taskId) setActiveTimer(null);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      timeAllocated: task.timeAllocated,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Task Management</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <div className="grid lg:grid-cols-[300px_1fr] gap-6">
              {/* Calendar Sidebar */}
              <div className="space-y-4">
                <Card className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md"
                  />
                </Card>

                {/* Week View */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">This Week</h3>
                  <div className="space-y-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          isSameDay(day, selectedDate)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="text-sm font-medium">{format(day, 'EEEE')}</div>
                        <div className="text-xs opacity-70">{format(day, 'MMM d')}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    Tasks for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Description (optional)"
                          value={newTask.description}
                          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Time Allocation (minutes)
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={newTask.timeAllocated}
                            onChange={(e) => setNewTask(prev => ({ ...prev, timeAllocated: parseInt(e.target.value) || 30 }))}
                          />
                        </div>
                        <Button onClick={handleAddTask} className="w-full">
                          Create Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {filteredTasks.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    No tasks for this day. Click "Add Task" to create one.
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <Card key={task.id} className={`p-4 ${task.completed ? 'opacity-60' : ''}`}>
                        {editingTask === task.id ? (
                          <div className="space-y-3">
                            <Input
                              value={newTask.title}
                              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <Textarea
                              value={newTask.description}
                              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <Input
                              type="number"
                              min="1"
                              value={newTask.timeAllocated}
                              onChange={(e) => setNewTask(prev => ({ ...prev, timeAllocated: parseInt(e.target.value) || 30 }))}
                            />
                            <div className="flex gap-2">
                              <Button onClick={() => handleUpdateTask(task.id)} size="sm">
                                Save
                              </Button>
                              <Button 
                                onClick={() => {
                                  setEditingTask(null);
                                  setNewTask({ title: '', description: '', timeAllocated: 30 });
                                }}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEdit(task)}
                                  disabled={task.completed}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                <span className="font-mono text-lg">
                                  {formatTime(task.timeRemaining)}
                                </span>
                              </div>

                              <Button
                                size="sm"
                                variant={task.isRunning ? "destructive" : "default"}
                                onClick={() => handleStartPause(task.id)}
                                disabled={task.completed || task.timeRemaining === 0}
                              >
                                {task.isRunning ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Start
                                  </>
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant={task.completed ? "outline" : "default"}
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                {task.completed ? 'Undo' : 'Complete'}
                              </Button>
                            </div>
                          </>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
