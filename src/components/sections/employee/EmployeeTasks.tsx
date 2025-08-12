import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  CheckSquare, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Filter
} from 'lucide-react';
import { TaskModal } from '@/components/modals/TaskModal';
import { Task } from '@/types/user';
import { useUser } from '@/contexts/UserContext';

interface EmployeeTasksProps {
  searchQuery: string;
}

// Mock data
const mockTasks: Task[] = [
  { 
    id: '1', 
    title: 'Complete project documentation', 
    description: 'Write comprehensive documentation for the new project',
    priority: 'high', 
    status: 'inprogress',
    dueDate: '2024-12-18',
    createdAt: '2024-12-15',
    userId: '1'
  },
  { 
    id: '2', 
    title: 'Review code changes', 
    description: 'Review pull requests from team members',
    priority: 'medium', 
    status: 'todo',
    dueDate: '2024-12-19',
    createdAt: '2024-12-16',
    userId: '1'
  },
  { 
    id: '3', 
    title: 'Team meeting preparation', 
    description: 'Prepare agenda and materials for weekly team meeting',
    priority: 'low', 
    status: 'completed',
    dueDate: '2024-12-20',
    createdAt: '2024-12-17',
    userId: '1'
  },
  { 
    id: '4', 
    title: 'Update database schema', 
    description: 'Implement new database schema changes',
    priority: 'high', 
    status: 'todo',
    dueDate: '2024-12-21',
    createdAt: '2024-12-18',
    userId: '1'
  },
  { 
    id: '5', 
    title: 'Client presentation slides', 
    description: 'Create presentation slides for client meeting',
    priority: 'medium', 
    status: 'inprogress',
    dueDate: '2024-12-22',
    createdAt: '2024-12-18',
    userId: '1'
  }
];

export const EmployeeTasks: React.FC<EmployeeTasksProps> = ({ searchQuery }) => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskModalMode, setTaskModalMode] = useState<'add' | 'edit'>('add');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesDate = !selectedDate || task.dueDate === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalMode('add');
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode('edit');
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskModalMode === 'add') {
      const newTask: Task = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        ...taskData as Omit<Task, 'id' | 'userId' | 'createdAt'>
      };
      setTasks([...tasks, newTask]);
    } else if (selectedTask) {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ));
    }
    setIsTaskModalOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'inprogress': return 'text-blue-600 bg-blue-50';
      case 'todo': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckSquare className="text-green-600" size={16} />;
      case 'inprogress': return <AlertCircle className="text-blue-600" size={16} />;
      case 'todo': return <Calendar className="text-orange-600" size={16} />;
      default: return <CheckSquare className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={taskModalMode}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <Button onClick={handleAddTask} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar size={16} className="mr-2" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Filter by Due Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(undefined)}
              className="text-xs"
            >
              Clear Date
            </Button>
          )}

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </Card>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4 hover-lift">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Due: {task.dueDate}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'inprogress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTask(task)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card className="p-8 text-center">
            <CheckSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No tasks match your search criteria.' : 'You haven\'t created any tasks yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddTask}>Create your first task</Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};