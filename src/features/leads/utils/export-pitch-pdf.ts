/**
 * Export Sales Pitch to PDF
 *
 * Client-side PDF generation using jsPDF
 */

import jsPDF from 'jspdf';
import type { SalesPitch } from '../types/sales-pitch';

interface PitchPDFOptions {
  leadName?: string;
  companyName?: string;
  showBranding?: boolean;
}

/**
 * Export sales pitch to branded PDF
 */
export function exportPitchToPDF(
  pitch: SalesPitch,
  options: PitchPDFOptions = {}
): void {
  const { leadName = 'Lead', showBranding = true } = options;

  // Create PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let currentY = margin;

  // Colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600
  const textColor: [number, number, number] = [23, 23, 23]; // Neutral-900
  const secondaryTextColor: [number, number, number] = [82, 82, 82]; // Neutral-600
  const accentColor: [number, number, number] = [147, 51, 234]; // Purple-600

  // Helper: Add section header
  const addSectionHeader = (title: string, y: number): number => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, y);
    return y + 6;
  };

  // Helper: Add bullet point
  const addBulletPoint = (text: string, y: number): number => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.circle(margin + 1, y - 1, 0.8, 'F');
    const lines = doc.splitTextToSize(text, contentWidth - 5);
    doc.text(lines, margin + 4, y);
    return y + lines.length * 3.5 + 2;
  };

  // Helper: Check if we need a new page
  const checkNewPage = (requiredSpace: number): void => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  // ------- HEADER -------
  if (showBranding) {
    // Gradient background for header (simulated with rectangle)
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AI Sales Brief', margin, 15);

    // Lead name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(leadName, margin, 25);

    // Relevance score badge (top right)
    const badgeX = pageWidth - margin - 25;
    const badgeY = 10;
    const badgeColor =
      pitch.relevanceScore >= 80
        ? [34, 197, 94] // Green
        : pitch.relevanceScore >= 60
          ? [59, 130, 246] // Blue
          : [234, 179, 8]; // Yellow
    doc.setFillColor(...badgeColor);
    doc.roundedRect(badgeX, badgeY, 25, 10, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${pitch.relevanceScore}%`, badgeX + 5, badgeY + 7);

    currentY = 45;
  } else {
    // Simple header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Sales Brief', margin, currentY);
    currentY += 10;
  }

  // ------- EXECUTIVE SUMMARY -------
  doc.setFillColor(245, 243, 255); // Indigo-50
  doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Executive Summary', margin + 3, currentY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const summaryLines = doc.splitTextToSize(pitch.summary, contentWidth - 6);
  doc.text(summaryLines, margin + 3, currentY + 12);

  currentY += 32;

  // ------- COMMON GROUND -------
  if (pitch.commonGround.length > 0) {
    checkNewPage(40);
    currentY = addSectionHeader('Common Ground', currentY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let tagX = margin;
    let tagY = currentY;

    pitch.commonGround.forEach((item) => {
      const tagWidth = doc.getTextWidth(item) + 6;
      if (tagX + tagWidth > pageWidth - margin) {
        tagX = margin;
        tagY += 8;
      }

      doc.setFillColor(209, 250, 229); // Green-100
      doc.roundedRect(tagX, tagY - 4, tagWidth, 6, 1, 1, 'F');
      doc.setTextColor(21, 128, 61); // Green-700
      doc.text(item, tagX + 3, tagY);

      tagX += tagWidth + 3;
    });

    currentY = tagY + 10;
  }

  // ------- KEY TALKING POINTS -------
  checkNewPage(60);
  currentY = addSectionHeader('Key Talking Points', currentY);
  pitch.talkingPoints.forEach((point) => {
    checkNewPage(15);
    currentY = addBulletPoint(point, currentY);
  });

  // ------- PAIN POINTS -------
  checkNewPage(60);
  currentY = addSectionHeader('Likely Pain Points', currentY + 3);
  pitch.painPoints.forEach((pain) => {
    checkNewPage(15);
    currentY = addBulletPoint(pain, currentY);
  });

  // ------- VALUE PROPOSITION -------
  checkNewPage(40);
  currentY += 3;
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text('Your Value Proposition', margin + 3, currentY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  const valueLines = doc.splitTextToSize(
    pitch.valueProposition,
    contentWidth - 6
  );
  doc.text(valueLines, margin + 3, currentY + 12);

  currentY += 32;

  // ------- CONVERSATION STARTERS -------
  checkNewPage(60);
  currentY = addSectionHeader('Conversation Starters', currentY);
  pitch.conversationStarters.forEach((starter) => {
    checkNewPage(15);
    currentY = addBulletPoint(starter, currentY);
  });

  // ------- COMPETITOR CONTEXT -------
  if (pitch.competitorContext) {
    checkNewPage(30);
    currentY += 3;
    doc.setFillColor(254, 252, 232); // Yellow-50
    doc.setDrawColor(234, 179, 8); // Yellow-500
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(133, 77, 14); // Yellow-900
    doc.text('Competitor Context', margin + 3, currentY + 6);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(161, 98, 7); // Yellow-800
    const competitorLines = doc.splitTextToSize(
      pitch.competitorContext,
      contentWidth - 6
    );
    doc.text(competitorLines, margin + 3, currentY + 12);

    currentY += 25;
  }

  // ------- FOOTER -------
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryTextColor);
  doc.text(
    `Generated ${new Date(pitch.generatedAt).toLocaleDateString()}`,
    margin,
    footerY
  );

  if (showBranding) {
    doc.text(
      'FlowTrack AI Sales Intelligence',
      pageWidth - margin - 60,
      footerY
    );
  }

  // Generate filename
  const filename = `sales-brief-${leadName.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;

  // Save PDF
  doc.save(filename);
}
