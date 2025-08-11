import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Calendar,
  Star,
  Clock,
  Filter
} from 'lucide-react';
import { Holiday } from '@/types/user';

interface EmployeeHolidaysProps {
  searchQuery: string;
}

const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'Christmas Day',
    date: '2024-12-25',
    type: 'mandatory',
    description: 'Public holiday - Christmas celebration',
    isUpcoming: true
  },
  {
    id: '2',
    name: 'New Year\'s Day',
    date: '2025-01-01',
    type: 'mandatory',
    description: 'Public holiday - New Year celebration',
    isUpcoming: true
  },
  {
    id: '3',
    name: 'Republic Day',
    date: '2025-01-26',
    type: 'mandatory',
    description: 'National holiday - Republic Day of India',
    isUpcoming: true
  },
  {
    id: '4',
    name: 'Holi (Optional)',
    date: '2025-03-14',
    type: 'optional',
    description: 'Festival of colors - Optional holiday',
    isUpcoming: true
  },
  {
    id: '5',
    name: 'Good Friday',
    date: '2025-04-18',
    type: 'mandatory',
    description: 'Christian holiday',
    isUpcoming: true
  },
  {
    id: '6',
    name: 'Independence Day',
    date: '2025-08-15',
    type: 'mandatory',
    description: 'National holiday - Independence Day of India',
    isUpcoming: true
  },
  {
    id: '7',
    name: 'Gandhi Jayanti',
    date: '2025-10-02',
    type: 'mandatory',
    description: 'National holiday - Birth anniversary of Mahatma Gandhi',
    isUpcoming: true
  },
  {
    id: '8',
    name: 'Diwali (Optional)',
    date: '2025-10-20',
    type: 'optional',
    description: 'Festival of lights - Optional holiday',
    isUpcoming: true
  },
  // Past holidays
  {
    id: '9',
    name: 'Diwali',
    date: '2024-11-01',
    type: 'mandatory',
    description: 'Festival of lights',
    isUpcoming: false
  },
  {
    id: '10',
    name: 'Dussehra',
    date: '2024-10-12',
    type: 'optional',
    description: 'Victory of good over evil',
    isUpcoming: false
  }
];

export const EmployeeHolidays: React.FC<EmployeeHolidaysProps> = ({ searchQuery }) => {
  const [holidays] = useState<Holiday[]>(mockHolidays);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewFilter, setViewFilter] = useState<string>('upcoming');

  // Filter holidays based on search query and filters
  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         holiday.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
    const matchesView = viewFilter === 'all' || 
                       (viewFilter === 'upcoming' && holiday.isUpcoming) ||
                       (viewFilter === 'past' && !holiday.isUpcoming);
    
    return matchesSearch && matchesType && matchesView;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mandatory': return 'text-blue-600 bg-blue-50';
      case 'optional': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mandatory': return <Star className="text-blue-600" size={16} />;
      case 'optional': return <Clock className="text-orange-600" size={16} />;
      default: return <Calendar className="text-gray-600" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const upcomingHolidays = holidays.filter(h => h.isUpcoming);
  const mandatoryCount = upcomingHolidays.filter(h => h.type === 'mandatory').length;
  const optionalCount = upcomingHolidays.filter(h => h.type === 'optional').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Company Holidays</h2>
          <p className="text-muted-foreground">View upcoming holidays and plan your time off</p>
        </div>
      </div>

      {/* Holiday Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Star className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Mandatory Holidays</p>
              <p className="text-xl font-bold">{mandatoryCount} upcoming</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="text-orange-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Optional Holidays</p>
              <p className="text-xl font-bold">{optionalCount} available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CalendarDays className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Total Holidays</p>
              <p className="text-xl font-bold">{mandatoryCount + optionalCount} this year</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={viewFilter} 
            onChange={(e) => setViewFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="mandatory">Mandatory</option>
            <option value="optional">Optional</option>
          </select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredHolidays.length} of {holidays.length} holidays
          </div>
        </div>
      </Card>

      {/* Holidays List */}
      <div className="grid gap-4">
        {filteredHolidays.map((holiday) => {
          const daysUntil = getDaysUntil(holiday.date);
          
          return (
            <Card key={holiday.id} className="p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {getTypeIcon(holiday.type)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{holiday.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{holiday.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(holiday.date)}</span>
                      </span>
                      {daysUntil && (
                        <span className="flex items-center space-x-1 text-green-600 font-medium">
                          <Clock size={12} />
                          <span>In {daysUntil}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(holiday.type)}`}>
                    {holiday.type}
                  </span>
                  {holiday.isUpcoming && daysUntil && daysUntil !== 'Today' && daysUntil !== 'Tomorrow' && (
                    <span className="text-xs text-muted-foreground">
                      {daysUntil}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filteredHolidays.length === 0 && (
          <Card className="p-8 text-center">
            <CalendarDays className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No holidays found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'No holidays match your search criteria.' : 'No holidays found for the selected filters.'}
            </p>
          </Card>
        )}
      </div>

      {/* Holiday Calendar View */}
      {viewFilter === 'upcoming' && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Next 3 Holidays</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingHolidays.slice(0, 3).map((holiday) => {
              const daysUntil = getDaysUntil(holiday.date);
              
              return (
                <div key={holiday.id} className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className={`inline-flex p-2 rounded-full mb-2 ${getTypeColor(holiday.type)}`}>
                    {getTypeIcon(holiday.type)}
                  </div>
                  <h4 className="font-medium text-foreground">{holiday.name}</h4>
                  <p className="text-sm text-muted-foreground">{holiday.date}</p>
                  {daysUntil && (
                    <p className="text-xs text-green-600 font-medium mt-1">In {daysUntil}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};