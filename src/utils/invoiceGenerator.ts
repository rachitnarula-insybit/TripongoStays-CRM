import jsPDF from 'jspdf';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

export const generateInvoice = (booking: Booking): void => {
  const pdf = new jsPDF();
  
  // Set up colors
  const primaryColor = '#EC6B2F';
  const darkGray = '#333333';
  const lightGray = '#666666';
  
  // Header
  pdf.setFillColor(primaryColor);
  pdf.rect(0, 0, 210, 40, 'F');
  
  // Logo and company name
  pdf.setTextColor('#FFFFFF');
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TripongoStays', 20, 25);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Premium Travel & Hospitality', 20, 32);
  
  // Invoice title
  pdf.setTextColor(darkGray);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 150, 25);
  
  // Invoice details
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice #: ${booking.bookingReference}`, 150, 32);
  pdf.text(`Date: ${formatDate(String(booking.createdDate))}`, 150, 37);
  
  // Company details
  let yPos = 55;
  pdf.setTextColor(darkGray);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('From:', 20, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('TripongoStays Private Limited', 20, yPos + 7);
  pdf.text('123 Business District', 20, yPos + 14);
  pdf.text('Mumbai, Maharashtra 400001', 20, yPos + 21);
  pdf.text('Phone: +91 98765 43210', 20, yPos + 28);
  pdf.text('Email: bookings@tripongostays.com', 20, yPos + 35);
  pdf.text('GST: 27ABCDE1234F1Z5', 20, yPos + 42);
  
  // Customer details
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('To:', 120, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(booking.guestName, 120, yPos + 7);
  pdf.text(booking.guestEmail, 120, yPos + 14);
  pdf.text(booking.guestPhone, 120, yPos + 21);
  
  // Booking details section
  yPos += 60;
  pdf.setFillColor('#F8F8F8');
  pdf.rect(15, yPos - 5, 180, 25, 'F');
  
  pdf.setTextColor(darkGray);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Booking Details', 20, yPos + 5);
  
  yPos += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const bookingDetails = [
    ['Property:', booking.propertyName],
    ['Check-in Date:', formatDate(String(booking.checkInDate))],
    ['Check-out Date:', formatDate(String(booking.checkOutDate))],
    ['Number of Nights:', booking.nights.toString()],
    ['Number of Guests:', booking.guests.toString()],
    ['Booking Status:', booking.status],
  ];
  
  bookingDetails.forEach(([label, value], index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 20, yPos + (index * 7));
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, yPos + (index * 7));
  });
  
  // Pricing table
  yPos += 60;
  pdf.setFillColor(primaryColor);
  pdf.rect(15, yPos - 5, 180, 15, 'F');
  
  pdf.setTextColor('#FFFFFF');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Pricing Breakdown', 20, yPos + 5);
  
  yPos += 20;
  
  // Table headers
  pdf.setFillColor('#F0F0F0');
  pdf.rect(15, yPos - 5, 180, 12, 'F');
  
  pdf.setTextColor(darkGray);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Description', 20, yPos + 2);
  pdf.text('Amount', 170, yPos + 2);
  
  yPos += 15;
  
  // Pricing rows
  const pricingRows = [
    [`Accommodation (${booking.nights} nights)`, formatCurrency(booking.baseAmount)],
    ['Taxes & Fees', formatCurrency(booking.taxAmount)],
  ];
  
  pdf.setFont('helvetica', 'normal');
  pricingRows.forEach(([description, amount], index) => {
    const rowY = yPos + (index * 10);
    pdf.text(description, 20, rowY);
    pdf.text(amount, 170, rowY);
  });
  
  // Total
  yPos += 30;
  pdf.setFillColor(primaryColor);
  pdf.rect(15, yPos - 5, 180, 15, 'F');
  
  pdf.setTextColor('#FFFFFF');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Total Amount:', 20, yPos + 5);
  pdf.text(formatCurrency(booking.totalAmount), 170, yPos + 5);
  
  // Payment status
  yPos += 25;
  pdf.setTextColor(darkGray);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Payment Status:', 20, yPos);
  
  const statusColor = booking.paymentStatus === 'Paid' ? '#27AE60' : 
                     booking.paymentStatus === 'Partial' ? '#F4A261' : '#EB5757';
  pdf.setTextColor(statusColor);
  pdf.text(booking.paymentStatus.toUpperCase(), 80, yPos);
  
  // Terms and conditions
  yPos += 20;
  pdf.setTextColor(lightGray);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  const terms = [
    'Terms & Conditions:',
    '• Check-in time: 3:00 PM | Check-out time: 11:00 AM',
    '• Cancellation policy applies as per booking terms',
    '• Valid government ID required at check-in',
    '• Property rules and regulations must be followed',
    '• Damage charges may apply for any property damage',
  ];
  
  terms.forEach((term, index) => {
    pdf.text(term, 20, yPos + (index * 5));
  });
  
  // Footer
  yPos += 40;
  pdf.setFillColor('#F8F8F8');
  pdf.rect(0, yPos - 5, 210, 20, 'F');
  
  pdf.setTextColor(lightGray);
  pdf.setFontSize(8);
  pdf.text('Thank you for choosing TripongoStays! For support, contact us at support@tripongostays.com', 20, yPos + 5);
  pdf.text('This is a computer-generated invoice and does not require a signature.', 20, yPos + 10);
  
  // Save the PDF
  const fileName = `invoice-${booking.bookingReference}-${booking.guestName.replace(/\s+/g, '-')}.pdf`;
  pdf.save(fileName);
};