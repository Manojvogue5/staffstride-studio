import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download,
  Eye,
  Calendar,
  DollarSign,
  Filter,
  Search
} from 'lucide-react';
import { Payslip } from '@/types/user';

interface EmployeePayslipsProps {
  searchQuery: string;
}

const mockPayslips: Payslip[] = [
  {
    id: '1',
    userId: '1',
    month: 'December',
    year: 2024,
    fileName: 'payslip_dec_2024.pdf',
    uploadedAt: '2024-12-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  },
  {
    id: '2',
    userId: '1',
    month: 'November',
    year: 2024,
    fileName: 'payslip_nov_2024.pdf',
    uploadedAt: '2024-11-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  },
  {
    id: '3',
    userId: '1',
    month: 'October',
    year: 2024,
    fileName: 'payslip_oct_2024.pdf',
    uploadedAt: '2024-10-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  },
  {
    id: '4',
    userId: '1',
    month: 'September',
    year: 2024,
    fileName: 'payslip_sep_2024.pdf',
    uploadedAt: '2024-09-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  },
  {
    id: '5',
    userId: '1',
    month: 'August',
    year: 2024,
    fileName: 'payslip_aug_2024.pdf',
    uploadedAt: '2024-08-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  },
  {
    id: '6',
    userId: '1',
    month: 'July',
    year: 2024,
    fileName: 'payslip_jul_2024.pdf',
    uploadedAt: '2024-07-01',
    uploadedBy: 'HR Team',
    grossSalary: 75000,
    netSalary: 58500,
    deductions: 16500
  }
];

export const EmployeePayslips: React.FC<EmployeePayslipsProps> = ({ searchQuery }) => {
  const [payslips] = useState<Payslip[]>(mockPayslips);
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Filter payslips based on search query and filters
  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payslip.year.toString().includes(searchQuery);
    const matchesYear = yearFilter === 'all' || payslip.year.toString() === yearFilter;
    
    return matchesSearch && matchesYear;
  });

  const handleDownload = (payslip: Payslip) => {
    // Mock download - in real app this would trigger actual file download
    const link = document.createElement('a');
    link.href = '#'; // This would be the actual file URL
    link.download = payslip.fileName;
    link.click();
    
    // Show confirmation
    alert(`Downloading ${payslip.fileName}...`);
  };

  const handleView = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUniqueYears = () => {
    const years = [...new Set(payslips.map(p => p.year))];
    return years.sort((a, b) => b - a);
  };

  const getCurrentYearStats = () => {
    const currentYear = new Date().getFullYear();
    const currentYearPayslips = payslips.filter(p => p.year === currentYear);
    const totalGross = currentYearPayslips.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
    const totalNet = currentYearPayslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const totalDeductions = currentYearPayslips.reduce((sum, p) => sum + (p.deductions || 0), 0);
    
    return { totalGross, totalNet, totalDeductions, count: currentYearPayslips.length };
  };

  const stats = getCurrentYearStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Payslips</h2>
          <p className="text-muted-foreground">View and download your salary slips</p>
        </div>
      </div>

      {/* Salary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">YTD Gross</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalGross)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">YTD Net</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalNet)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">YTD Deductions</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalDeductions)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">Payslips</p>
              <p className="text-xl font-bold">{stats.count} slips</p>
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
            value={yearFilter} 
            onChange={(e) => setYearFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Years</option>
            {getUniqueYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredPayslips.length} of {payslips.length} payslips
          </div>
        </div>
      </Card>

      {/* Payslips Grid */}
      <div className="grid gap-4">
        {filteredPayslips.map((payslip) => (
          <Card key={payslip.id} className="p-4 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground">{payslip.month} {payslip.year}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Salary Slip</p>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Uploaded: {payslip.uploadedAt}</span>
                    </span>
                    <span>By: {payslip.uploadedBy}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {payslip.grossSalary && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Gross Salary</p>
                    <p className="font-semibold text-foreground">{formatCurrency(payslip.grossSalary)}</p>
                    {payslip.netSalary && (
                      <p className="text-xs text-muted-foreground">Net: {formatCurrency(payslip.netSalary)}</p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(payslip)}
                    className="flex items-center space-x-1"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(payslip)}
                    className="flex items-center space-x-1"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredPayslips.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No payslips found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'No payslips match your search criteria.' : 'No payslips have been uploaded yet.'}
            </p>
          </Card>
        )}
      </div>

      {/* Payslip Detail Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPayslip(null)}>
          <Card className="max-w-md w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payslip Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(null)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground">{selectedPayslip.month} {selectedPayslip.year}</h4>
                <p className="text-sm text-muted-foreground">{selectedPayslip.fileName}</p>
              </div>
              
              {selectedPayslip.grossSalary && (
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Gross Salary:</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.grossSalary)}</span>
                  </div>
                  {selectedPayslip.deductions && (
                    <div className="flex justify-between">
                      <span>Deductions:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedPayslip.deductions)}</span>
                    </div>
                  )}
                  {selectedPayslip.netSalary && (
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Net Salary:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(selectedPayslip.netSalary)}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleDownload(selectedPayslip)} 
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};