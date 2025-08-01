import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square } from 'lucide-react';

interface CheckInData {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  totalHours: string;
  todayHours: string;
}

export const CheckInOut: React.FC = () => {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null,
    totalHours: '0h 0m',
    todayHours: '8h 30m' // Mock data
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInData({
      ...checkInData,
      isCheckedIn: true,
      checkInTime: now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }),
      checkOutTime: null
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckInData({
      ...checkInData,
      isCheckedIn: false,
      checkOutTime: now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  };

  const calculateWorkedHours = () => {
    if (checkInData.checkInTime && checkInData.isCheckedIn) {
      const checkIn = new Date();
      const [hours, minutes] = checkInData.checkInTime.split(':');
      checkIn.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const diff = currentTime.getTime() - checkIn.getTime();
      const workedHours = Math.floor(diff / (1000 * 60 * 60));
      const workedMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${workedHours}h ${workedMinutes}m`;
    }
    return checkInData.totalHours;
  };

  return (
    <Card className="card-professional">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Clock className="mr-2" size={20} />
          Check In/Out
        </h3>
        <div className="text-sm text-muted-foreground">
          {currentTime.toLocaleTimeString('en-US', { 
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Check In</p>
          <p className="text-lg font-bold text-foreground">
            {checkInData.checkInTime || '--:--'}
          </p>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Check Out</p>
          <p className="text-lg font-bold text-foreground">
            {checkInData.checkOutTime || '--:--'}
          </p>
        </div>
        
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Hours Today</p>
          <p className="text-lg font-bold text-foreground">
            {calculateWorkedHours()}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!checkInData.isCheckedIn ? (
          <Button 
            onClick={handleCheckIn}
            className="btn-professional flex items-center space-x-2"
            size="lg"
          >
            <Play size={18} />
            <span>Check In</span>
          </Button>
        ) : (
          <Button 
            onClick={handleCheckOut}
            variant="outline"
            className="flex items-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            size="lg"
          >
            <Square size={18} />
            <span>Check Out</span>
          </Button>
        )}
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Status:</span>
          <span className={`status-${checkInData.isCheckedIn ? 'success' : 'pending'}`}>
            {checkInData.isCheckedIn ? 'Checked In' : 'Checked Out'}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-foreground">This Month:</span>
          <span className="text-sm font-bold text-foreground">{checkInData.todayHours}</span>
        </div>
      </div>
    </Card>
  );
};