// CSV Export Utility Functions
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Convert data to CSV format
  const csvContent = convertToCSV(data, headers);
  
  // Create and download file
  downloadCSV(csvContent, filename);
};

export const convertToCSV = (data, headers = null) => {
  if (!data || data.length === 0) return '';

  // Get headers from first object or use provided headers
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = csvHeaders.map(header => 
    typeof header === 'string' ? header : header.label || header.key
  ).join(',');

  // Create CSV data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const key = typeof header === 'string' ? header : header.key;
      const value = row[key];
      
      // Handle different data types
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`; // Escape quotes
      }
      return value;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

export const downloadCSV = (csvContent, filename) => {
  // Add BOM for proper UTF-8 encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Specific export functions for different data types
export const exportAttendanceRecords = (records, filename = 'attendance_records.csv') => {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'userName', label: 'Employee Name' },
    { key: 'userEmail', label: 'Email' },
    { key: 'teamName', label: 'Team' },
    { key: 'status', label: 'Status' },
    { key: 'checkInTime', label: 'Check-in Time' },
    { key: 'checkOutTime', label: 'Check-out Time' },
    { key: 'workHours', label: 'Work Hours' },
    { key: 'notes', label: 'Notes' },
    { key: 'location', label: 'Location' },
    { key: 'markedByName', label: 'Marked By' }
  ];

  exportToCSV(records, filename, headers);
};

export const exportTeamAttendance = (teamData, filename = 'team_attendance.csv') => {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'userName', label: 'Employee Name' },
    { key: 'status', label: 'Status' },
    { key: 'checkInTime', label: 'Check-in Time' },
    { key: 'checkOutTime', label: 'Check-out Time' },
    { key: 'workHours', label: 'Work Hours' },
    { key: 'notes', label: 'Notes' }
  ];

  exportToCSV(teamData, filename, headers);
};

export const exportUserAttendance = (userData, filename = 'my_attendance.csv') => {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'teamName', label: 'Team' },
    { key: 'status', label: 'Status' },
    { key: 'checkInTime', label: 'Check-in Time' },
    { key: 'checkOutTime', label: 'Check-out Time' },
    { key: 'workHours', label: 'Work Hours' },
    { key: 'notes', label: 'Notes' },
    { key: 'location', label: 'Location' }
  ];

  exportToCSV(userData, filename, headers);
};

export const exportAttendanceSummary = (summaryData, filename = 'attendance_summary.csv') => {
  const headers = [
    { key: 'userName', label: 'Employee Name' },
    { key: 'totalDays', label: 'Total Days' },
    { key: 'presentDays', label: 'Present Days' },
    { key: 'absentDays', label: 'Absent Days' },
    { key: 'lateDays', label: 'Late Days' },
    { key: 'attendancePercentage', label: 'Attendance %' },
    { key: 'totalWorkHours', label: 'Total Work Hours' }
  ];

  exportToCSV(summaryData, filename, headers);
};

export const exportReportsData = (reportData, filename = 'attendance_report.csv') => {
  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'present', label: 'Present' },
    { key: 'absent', label: 'Absent' },
    { key: 'late', label: 'Late' },
    { key: 'leave', label: 'Leave' },
    { key: 'half_day', label: 'Half Day' },
    { key: 'total', label: 'Total' }
  ];

  exportToCSV(reportData, filename, headers);
};

// Utility function to format data for CSV export
export const formatAttendanceDataForCSV = (attendanceData) => {
  return attendanceData.map(record => ({
    date: record.date,
    userName: record.user?.name || record.userName || 'N/A',
    userEmail: record.user?.email || record.userEmail || 'N/A',
    teamName: record.team?.name || record.teamName || 'N/A',
    status: record.status,
    checkInTime: record.checkInTime || 'N/A',
    checkOutTime: record.checkOutTime || 'N/A',
    workHours: record.workHours || 0,
    notes: record.notes || '',
    location: record.location || 'N/A',
    markedByName: record.markedByUser?.name || record.markedByName || 'Self'
  }));
};

// Generate filename with current date
export const generateFilename = (prefix = 'export', extension = 'csv') => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${prefix}_${dateStr}_${timeStr}.${extension}`;
};
