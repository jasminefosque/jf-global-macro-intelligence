import html2canvas from 'html2canvas';

export async function exportChartAsPNG(element: HTMLElement, filename: string): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting chart:', error);
    alert('Failed to export chart. Please try again.');
  }
}

export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
