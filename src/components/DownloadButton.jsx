import React from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

// Import jsPDF and autoTable properly
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DownloadButton = ({ 
    data, 
    filename, 
    columns, 
    title,
    type = 'both' 
}) => {
    const exportToExcel = () => {
        if (!data || data.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            const excelData = data.map(item => {
                const row = {};
                columns.forEach(col => {
                    let value = item[col.key];
                    if (col.key.includes('Time') || col.key.includes('Date')) {
                        if (value) {
                            value = new Date(value).toLocaleString();
                        } else {
                            value = '-';
                        }
                    }
                    row[col.label] = value !== undefined && value !== null ? value : '-';
                });
                return row;
            });

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully');
        } catch (error) {
            console.error('Excel export error:', error);
            toast.error('Failed to export Excel');
        }
    };

    const exportToPDF = () => {
        if (!data || data.length === 0) {
            toast.warning('No data to export');
            return;
        }

        try {
            // Create new PDF document with landscape orientation
            const doc = new jsPDF('landscape', 'mm', 'a4');
            
            // Add title
            doc.setFontSize(16);
            doc.setTextColor(33, 37, 41);
            doc.text(title || filename, 14, 15);
            
            // Add timestamp
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
            
            // Prepare table data
            const tableData = data.map(item => {
                return columns.map(col => {
                    let value = item[col.key];
                    if (col.key.includes('Time') || col.key.includes('Date')) {
                        if (value) {
                            value = new Date(value).toLocaleString();
                        } else {
                            value = '-';
                        }
                    }
                    return value !== undefined && value !== null ? String(value) : '-';
                });
            });

            // Add table with autoTable
            doc.autoTable({
                head: [columns.map(col => col.label)],
                body: tableData,
                startY: 30,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [33, 37, 41],
                },
                headStyles: {
                    fillColor: [13, 110, 253],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                alternateRowStyles: {
                    fillColor: [240, 242, 245],
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                },
                margin: { top: 30, left: 10, right: 10 },
                didDrawPage: function(data) {
                    // Add page number at the bottom
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    doc.text(
                        `Page ${data.pageNumber} of ${pageCount}`,
                        doc.internal.pageSize.getWidth() - 20,
                        doc.internal.pageSize.getHeight() - 10
                    );
                }
            });

            // Save PDF
            doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF exported successfully');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to export PDF: ' + error.message);
        }
    };

    return (
        <div className="btn-group">
            {(type === 'excel' || type === 'both') && (
                <button
                    className="btn btn-outline-success btn-sm"
                    onClick={exportToExcel}
                    title="Download Excel"
                    disabled={!data || data.length === 0}
                >
                    <FaFileExcel className="me-1" />
                    Excel
                </button>
            )}
            {(type === 'pdf' || type === 'both') && (
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={exportToPDF}
                    title="Download PDF"
                    disabled={!data || data.length === 0}
                >
                    <FaFilePdf className="me-1" />
                    PDF
                </button>
            )}
        </div>
    );
};

export default DownloadButton;