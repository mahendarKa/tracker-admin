import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Decode HTML entities
export const decodeHTMLEntities = (text) => {
    if (!text) return '-';
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
};

// Clean data for export
export const cleanDataForExport = (data, columns) => {
    return data.map(item => {
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
            if (typeof value === 'string') {
                value = decodeHTMLEntities(value);
            }
            row[col.label] = value !== undefined && value !== null ? value : '-';
        });
        return row;
    });
};

// Export to Excel
export const exportToExcel = (data, filename, columns) => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    try {
        const excelData = cleanDataForExport(data, columns);
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
        return true;
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
};

// Export to PDF
export const exportToPDF = (data, filename, columns, title, deviceInfo) => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    try {
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(33, 37, 41);
        doc.text(title || filename, 14, 15);
        
        // Add device info and timestamp
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        if (deviceInfo) {
            doc.text(`Device: ${deviceInfo}`, 14, 22);
        }
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, deviceInfo ? 28 : 22);
        
        // Prepare table data with decoded HTML entities
        const tableHeaders = columns.map(col => col.label);
        const tableBody = data.map(item => {
            return columns.map(col => {
                let value = item[col.key];
                if (col.key.includes('Time') || col.key.includes('Date')) {
                    if (value) {
                        value = new Date(value).toLocaleString();
                    } else {
                        value = '-';
                    }
                }
                if (typeof value === 'string') {
                    value = decodeHTMLEntities(value);
                }
                return value !== undefined && value !== null ? String(value) : '-';
            });
        });

        const startY = deviceInfo ? 35 : 30;

        autoTable(doc, {
            head: [tableHeaders],
            body: tableBody,
            startY: startY,
            styles: {
                fontSize: 7,
                cellPadding: 2,
                textColor: [33, 37, 41],
            },
            headStyles: {
                fillColor: [13, 110, 253],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [240, 242, 245],
            },
            margin: { top: startY, left: 10, right: 10 },
            didDrawPage: function(data) {
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

        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        throw error;
    }
};