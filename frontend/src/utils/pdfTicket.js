// PDF Ticket Generator — Silver Key Hotel
// Uses jsPDF loaded from CDN (imported dynamically)

export async function generateBookingTicketPDF(booking) {
  // Dynamically load jsPDF from CDN
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;

  // Color palette
  const GOLD = [212, 175, 55];
  const DARK = [26, 26, 26];
  const CREAM = [245, 240, 232];
  const GRAY = [100, 100, 100];
  const WHITE = [255, 255, 255];

  // ── Background ──────────────────────────────────────────────────────
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, W, H, 'F');

  // ── Header band ─────────────────────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 52, 'F');

  // Gold accent strip
  doc.setFillColor(...GOLD);
  doc.rect(0, 52, W, 3, 'F');

  // Hotel name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...GOLD);
  doc.text('SILVER KEY', W / 2, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 160, 100);
  doc.text('H  O  T  E  L   &   R  E  S  O  R  T', W / 2, 33, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('BOOKING CONFIRMATION TICKET', W / 2, 45, { align: 'center' });

  // ── Booking ID badge ─────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.roundedRect(60, 60, 90, 18, 3, 3, 'F');
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.roundedRect(60, 60, 90, 18, 3, 3, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text(booking.bookingId || 'SKH-XXXXXX', W / 2, 72, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text('BOOKING REFERENCE', W / 2, 84, { align: 'center' });

  // ── Status badge ──────────────────────────────────────────────────────
  const status = (booking.status || 'confirmed').toUpperCase();
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(W / 2 - 20, 88, 40, 9, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(`✓  ${status}`, W / 2, 94.5, { align: 'center' });

  // ── Divider with dashes ────────────────────────────────────────────
  doc.setDrawColor(200, 185, 150);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(20, 105, W - 20, 105);
  doc.setLineDashPattern([], 0);

  // ── Helpers ───────────────────────────────────────────────────────────
  let y = 116;

  function sectionHeader(title, yPos) {
    doc.setFillColor(...GOLD);
    doc.rect(20, yPos - 5, 4, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(title, 28, yPos + 4);
    return yPos + 16;
  }

  function detailRow(label, value, yPos) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.text(label, 22, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    // Truncate long values
    const val = String(value || '—');
    doc.text(val.length > 40 ? val.substring(0, 40) + '...' : val, 90, yPos);
    return yPos + 8;
  }

  // ── Guest Information ─────────────────────────────────────────────────
  y = sectionHeader('GUEST INFORMATION', y);
  const guestName = `${booking.guest?.firstName || ''} ${booking.guest?.lastName || ''}`.trim();
  y = detailRow('Guest Name', guestName || '—', y);
  y = detailRow('Email Address', booking.guest?.email || '—', y);
  y = detailRow('Phone Number', booking.guest?.phone || '—', y);
  if (booking.guest?.idType && booking.guest?.idNumber) {
    y = detailRow('ID Proof', `${booking.guest.idType.toUpperCase()} — ${booking.guest.idNumber}`, y);
  }
  y += 5;

  // ── Stay Details ──────────────────────────────────────────────────────
  y = sectionHeader('STAY DETAILS', y);
  const roomName = booking.room?.name || booking.roomName || 'Deluxe Room';
  const roomType = booking.room?.type || '';
  y = detailRow('Room', roomName + (roomType ? ` (${roomType})` : ''), y);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    });

  y = detailRow('Check-in Date', fmtDate(booking.checkIn), y);
  y = detailRow('Check-in Time', '2:00 PM (14:00 hrs)', y);
  y = detailRow('Check-out Date', fmtDate(booking.checkOut), y);
  y = detailRow('Check-out Time', '12:00 PM (12:00 hrs)', y);
  y = detailRow('Duration', `${booking.nights} Night${booking.nights !== 1 ? 's' : ''}`, y);
  y = detailRow(
    'Guests',
    `${booking.adults} Adult${booking.adults !== 1 ? 's' : ''}${
      booking.children ? ` + ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}` : ''
    }`,
    y
  );
  if (booking.guest?.specialRequests) {
    y = detailRow('Special Requests', booking.guest.specialRequests, y);
  }
  y += 5;

  // ── Payment Summary ───────────────────────────────────────────────────
  y = sectionHeader('PAYMENT SUMMARY', y);
  if (booking.pricing) {
    const p = booking.pricing;
    y = detailRow('Room Rate (per night)', `Rs.${(p.roomRate || 0).toLocaleString('en-IN')}`, y);
    y = detailRow('Total Room Charge', `Rs.${(p.totalRoomCharge || 0).toLocaleString('en-IN')}`, y);
    if (p.discount > 0) {
      y = detailRow('Discount Applied', `Rs.${(p.discount || 0).toLocaleString('en-IN')}`, y);
    }
    y = detailRow('Taxes & GST', `Rs.${(p.taxes || 0).toLocaleString('en-IN')}`, y);

    // Grand total highlight box
    y += 4;
    doc.setFillColor(...DARK);
    doc.rect(20, y - 5, W - 40, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GOLD);
    doc.text('TOTAL PAID', 28, y + 5);
    doc.text(`Rs.${(p.grandTotal || 0).toLocaleString('en-IN')}`, W - 25, y + 5, { align: 'right' });
    y += 22;
  }

  if (booking.payment?.razorpayPaymentId) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(`Transaction ID: ${booking.payment.razorpayPaymentId}`, 22, y);
    y += 8;
  }

  // ── Important Notes ───────────────────────────────────────────────────
  if (y < H - 70) {
    y += 4;
    y = sectionHeader('IMPORTANT NOTES', y);
    const notes = [
      'Carry this ticket and a valid government-issued photo ID at check-in.',
      'Early check-in and late check-out are subject to room availability.',
      'Hotel is a non-smoking property — designated areas available.',
      'For assistance call: +91 93228 00100 (24x7 Reception)',
    ];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    notes.forEach((note) => {
      doc.text(`• ${note}`, 22, y);
      y += 7;
    });
  }

  // ── Footer ────────────────────────────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, H - 28, W, 28, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, H - 28, W, 1.5, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 140, 90);
  doc.text('#12, Palace Road, Mysuru – 570001, Karnataka, India', W / 2, H - 18, { align: 'center' });
  doc.text('+91 93228 00100  |  reservations@silverkeyhotel.com', W / 2, H - 11, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  const genOn = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  doc.text(`Generated on ${genOn} — Silver Key Hotel, All rights reserved`, W / 2, H - 4, { align: 'center' });

  return doc;
}

export async function downloadBookingTicket(booking) {
  const doc = await generateBookingTicketPDF(booking);
  doc.save(`Silver-Key-Ticket-${booking.bookingId}.pdf`);
}

export async function getTicketDataURL(booking) {
  const doc = await generateBookingTicketPDF(booking);
  return doc.output('datauristring');
}
