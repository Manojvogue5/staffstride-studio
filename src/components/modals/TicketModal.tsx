import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from '@/types/user';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Partial<Ticket>) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ticket: Partial<Ticket> = {
      title: formData.title,
      description: formData.description,
      urgency: formData.urgency,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmit(ticket);
    onClose();
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      urgency: 'medium'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Raise Support Ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Issue Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Urgency Level
            </label>
            <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="medium">Medium - Standard issue</SelectItem>
                <SelectItem value="high">High - Urgent issue</SelectItem>
                <SelectItem value="critical">Critical - System down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Detailed Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide detailed information about the issue, including steps to reproduce, error messages, etc."
              rows={5}
              required
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Your ticket will be assigned a unique ID and you'll be notified via email when there's an update. For critical issues, please also contact IT support directly.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">
              Submit Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};