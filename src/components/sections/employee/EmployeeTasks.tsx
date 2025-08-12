import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  CheckSquare, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Filter,
  Search,
  X
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
  
  // Unified filter states
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter tasks based on all criteria
  const filteredTasks = tasks.filter(task => {
    const searchText = localSearchQuery || searchQuery;
    const matchesSearch = !searchText || 
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesDate = !selectedDate || task.dueDate === format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const clearAllFilters = () => {
    setLocalSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedDate(undefined);
  };

  const hasActiveFilters = localSearchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || selectedDate;

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

      {/* Unified Filter System */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Main Filter Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Filter size={16} />
                  <span>
                    {hasActiveFilters ? 'Filters Applied' : 'All Filters'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasActiveFilters && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                      {[
                        localSearchQuery && 'Search',
                        statusFilter !== 'all' && 'Status',
                        priorityFilter !== 'all' && 'Priority',
                        selectedDate && 'Date'
                      ].filter(Boolean).length}
                    </span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filter Tasks</h4>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      <X size={14} className="mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search tasks..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar size={16} className="mr-2" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Select due date</span>}
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
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {localSearchQuery && (
                <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                  <Search size={12} className="mr-1" />
                  Search: "{localSearchQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalSearchQuery('')}
                    className="ml-1 h-auto p-0 text-blue-700 hover:text-blue-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              
              {statusFilter !== 'all' && (
                <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                  Status: {statusFilter === 'inprogress' ? 'In Progress' : statusFilter === 'todo' ? 'To Do' : 'Completed'}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 h-auto p-0 text-green-700 hover:text-green-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              
              {priorityFilter !== 'all' && (
                <div className="flex items-center bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs">
                  Priority: {priorityFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriorityFilter('all')}
                    className="ml-1 h-auto p-0 text-orange-700 hover:text-orange-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
              
              {selectedDate && (
                <div className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
                  <Calendar size={12} className="mr-1" />
                  Date: {format(selectedDate, "MMM dd")}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(undefined)}
                    className="ml-1 h-auto p-0 text-purple-700 hover:text-purple-900"
                  >
                    <X size={12} />
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
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