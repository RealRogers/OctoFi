/**
 * Export Service
 * Handles data export functionality for CSV and PDF formats
 */

import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  filename?: string;
  title?: string;
  headers?: string[];
  includeTimestamp?: boolean;
}

class ExportService {
  /**
   * Export data to CSV format
   */
  toCSV(data: ExportData[], options: ExportOptions = {}): void {
    try {
      const {
        filename = 'agent-data-export',
        includeTimestamp = true
      } = options;

      // Add timestamp to data if requested
      const exportData = includeTimestamp 
        ? data.map(row => ({
            ...row,
            exportedAt: new Date().toISOString()
          }))
        : data;

      // Convert to CSV
      const csv = Papa.unparse(exportData, {
        header: true,
        skipEmptyLines: true
      });

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `${filename}-${timestamp}.csv`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
      throw new Error('Failed to export CSV file');
    }
  }

  /**
   * Export data to PDF format
   */
  toPDF(data: ExportData[], options: ExportOptions = {}): void {
    try {
      const {
        filename = 'agent-performance-report',
        title = 'AI Trading Agent Performance Report',
        headers,
        includeTimestamp = true
      } = options;

      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 30, { align: 'center' });

      // Add timestamp
      if (includeTimestamp) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated: ${timestamp}`, pageWidth / 2, 40, { align: 'center' });
      }

      // Prepare table data
      if (data.length > 0) {
        const tableHeaders = headers || Object.keys(data[0]);
        const tableData = data.map(row => 
          tableHeaders.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'number') {
              return value.toFixed(2);
            }
            if (value instanceof Date) {
              return value.toLocaleDateString();
            }
            return String(value);
          })
        );

        // Add table
        doc.autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: includeTimestamp ? 50 : 40,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [59, 130, 246], // Blue color
            textColor: 255,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          tableLineColor: [200, 200, 200],
          tableLineWidth: 0.1,
        });
      }

      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`${filename}-${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF file');
    }
  }

  /**
   * Export trading history data
   */
  exportTradingHistory(trades: any[], format: 'csv' | 'pdf' = 'csv'): void {
    const exportData = trades.map(trade => ({
      timestamp: new Date(trade.timestamp).toLocaleString(),
      type: trade.type || 'Trade',
      fromToken: trade.fromToken || 'N/A',
      toToken: trade.toToken || 'N/A',
      amount: trade.amount || 0,
      status: trade.status || 'Unknown',
      profitLoss: trade.profitLoss || 0,
      gasUsed: trade.gasUsed || 0,
      hash: trade.hash || 'N/A'
    }));

    const options: ExportOptions = {
      filename: 'trading-history',
      title: 'Trading History Report',
      headers: [
        'timestamp',
        'type', 
        'fromToken',
        'toToken',
        'amount',
        'status',
        'profitLoss',
        'gasUsed',
        'hash'
      ]
    };

    if (format === 'csv') {
      this.toCSV(exportData, options);
    } else {
      this.toPDF(exportData, options);
    }
  }

  /**
   * Export performance metrics
   */
  exportPerformanceMetrics(performance: any, format: 'csv' | 'pdf' = 'csv'): void {
    const exportData = [{
      totalTrades: performance.totalTrades || 0,
      successfulTrades: performance.successfulTrades || 0,
      totalProfitLoss: performance.totalProfitLoss || 0,
      averageReturn: performance.averageReturn || 0,
      winRate: performance.winRate || 0,
      sharpeRatio: performance.sharpeRatio || 0,
      maxDrawdown: performance.maxDrawdown || 0,
      exportDate: new Date().toLocaleDateString()
    }];

    const options: ExportOptions = {
      filename: 'performance-metrics',
      title: 'Performance Metrics Report',
      headers: [
        'totalTrades',
        'successfulTrades', 
        'totalProfitLoss',
        'averageReturn',
        'winRate',
        'sharpeRatio',
        'maxDrawdown',
        'exportDate'
      ]
    };

    if (format === 'csv') {
      this.toCSV(exportData, options);
    } else {
      this.toPDF(exportData, options);
    }
  }

  /**
   * Export agent actions/audit trail
   */
  exportAuditTrail(actions: any[], format: 'csv' | 'pdf' = 'csv'): void {
    const exportData = actions.map(action => ({
      timestamp: new Date(action.timestamp).toLocaleString(),
      type: action.type,
      result: action.result,
      description: action.description || 'N/A',
      error: action.error || 'N/A',
      data: JSON.stringify(action.data || {})
    }));

    const options: ExportOptions = {
      filename: 'agent-audit-trail',
      title: 'Agent Audit Trail Report',
      headers: [
        'timestamp',
        'type',
        'result',
        'description',
        'error',
        'data'
      ]
    };

    if (format === 'csv') {
      this.toCSV(exportData, options);
    } else {
      this.toPDF(exportData, options);
    }
  }

  /**
   * Export comprehensive dashboard report
   */
  exportDashboardReport(dashboardData: {
    performance?: any;
    trades?: any[];
    actions?: any[];
    strategy?: any;
  }, format: 'csv' | 'pdf' = 'pdf'): void {
    const { performance, trades, actions, strategy } = dashboardData;

    if (format === 'pdf') {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPosition = 30;

        // Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('AI Trading Agent Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;

        // Timestamp
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;

        // Performance Summary
        if (performance) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Performance Summary', margin, yPosition);
          yPosition += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const perfText = [
            `Total Trades: ${performance.totalTrades || 0}`,
            `Successful Trades: ${performance.successfulTrades || 0}`,
            `Total P&L: $${(performance.totalProfitLoss || 0).toFixed(2)}`,
            `Win Rate: ${(performance.winRate || 0).toFixed(1)}%`,
            `Average Return: ${(performance.averageReturn || 0).toFixed(2)}%`,
            `Sharpe Ratio: ${(performance.sharpeRatio || 0).toFixed(2)}`,
            `Max Drawdown: ${(performance.maxDrawdown || 0).toFixed(2)}%`
          ];

          perfText.forEach(text => {
            doc.text(text, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 10;
        }

        // Strategy Information
        if (strategy) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Current Strategy', margin, yPosition);
          yPosition += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const strategyText = [
            `Risk Tolerance: ${strategy.riskTolerance || 'N/A'}`,
            `Max Slippage: ${strategy.maxSlippage || 0}%`,
            `Stop Loss: ${(strategy.stopLoss || 0) * 100}%`,
            `Take Profit: ${(strategy.takeProfit || 0) * 100}%`,
            `Rebalance Threshold: ${(strategy.rebalanceThreshold || 0) * 100}%`
          ];

          strategyText.forEach(text => {
            doc.text(text, margin, yPosition);
            yPosition += 8;
          });
          yPosition += 10;
        }

        // Recent Trades Table
        if (trades && trades.length > 0) {
          doc.addPage();
          yPosition = 30;
          
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Recent Trading Activity', margin, yPosition);
          yPosition += 10;

          const recentTrades = trades.slice(-10); // Last 10 trades
          const tradeHeaders = ['Date', 'Type', 'From', 'To', 'Amount', 'Status', 'P&L'];
          const tradeData = recentTrades.map(trade => [
            new Date(trade.timestamp).toLocaleDateString(),
            trade.type || 'Trade',
            trade.fromToken || 'N/A',
            trade.toToken || 'N/A',
            (trade.amount || 0).toString(),
            trade.status || 'Unknown',
            `$${(trade.profitLoss || 0).toFixed(2)}`
          ]);

          doc.autoTable({
            head: [tradeHeaders],
            body: tradeData,
            startY: yPosition,
            margin: { left: margin, right: margin },
            styles: { fontSize: 8 },
            headStyles: { fillColor: [59, 130, 246] }
          });
        }

        // Save the comprehensive report
        const timestamp = new Date().toISOString().split('T')[0];
        doc.save(`dashboard-report-${timestamp}.pdf`);
      } catch (error) {
        console.error('Dashboard report export failed:', error);
        throw new Error('Failed to export dashboard report');
      }
    } else {
      // For CSV, export performance data
      if (performance) {
        this.exportPerformanceMetrics(performance, 'csv');
      }
    }
  }
}

// Create and export singleton instance
export const exportService = new ExportService();

// Export class for testing
export { ExportService };