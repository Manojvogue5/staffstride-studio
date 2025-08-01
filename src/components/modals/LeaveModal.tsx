import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LeaveRequest } from '@/types/user';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leave: Partial<LeaveRequest>) => void;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    type: 'casual' as 'sick' | 'casual' | 'vacation' | 'personal',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    documents: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leave: Partial<LeaveRequest> = {
      type: formData.type,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate.toISOString().split('T')[0],
      reason: formData.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      documents: formData.documents.map(file => file.name)
    };

    onSubmit(leave);
    onClose();
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      type: 'casual',
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
      documents: []
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({ ...formData, documents: [...formData.documents, ...newFiles] });
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocs });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Leave Type
            </label>
            <Select value={formData.type} onValueChange={(value: 'sick' | 'casual' | 'vacation' | 'personal') => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="casual">Casual Leave</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                From Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                To Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.endDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Reason
            </label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Enter reason for leave"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Supporting Documents (Optional)
            </label>
            <div className="space-y-2">
              <Button type="button" variant="outline" className="w-full" asChild>
                <label className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
              
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm text-foreground">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};