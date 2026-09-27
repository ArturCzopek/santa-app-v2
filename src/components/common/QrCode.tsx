import React from 'react';
import qrcode from 'qrcode-generator';

interface QrCodeProps {
  text: string;
  size?: number;
  label: string;
}

// Scanners need a light margin of four modules around the code.
const quietZone = 4;

// The dark modules as one SVG path, so the page and the downloaded file draw
// exactly the same code. Pure black on white whatever the theme: it scans.
const qrPath = (text: string) => {
  const code = qrcode(0, 'M');
  code.addData(text);
  code.make();
  const count = code.getModuleCount();
  let d = '';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (code.isDark(row, col)) {
        d += `M${col + quietZone} ${row + quietZone}h1v1h-1z`;
      }
    }
  }
  return { d, viewSize: count + quietZone * 2 };
};

const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// The same code as a standalone SVG file, for downloading and printing.
export const qrCodeSvg = (text: string, label: string, size = 240) => {
  const { d, viewSize } = qrPath(text);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(label)}"` +
    ` width="${size}" height="${size}" viewBox="0 0 ${viewSize} ${viewSize}" shape-rendering="crispEdges">` +
    `<rect width="${viewSize}" height="${viewSize}" fill="#ffffff"/><path d="${d}" fill="#000000"/></svg>`
  );
};

const QrCode: React.FC<QrCodeProps> = ({ text, size = 240, label }) => {
  const { d, viewSize } = qrPath(text);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      shapeRendering="crispEdges"
    >
      <rect width={viewSize} height={viewSize} fill="#ffffff" />
      <path d={d} fill="#000000" />
    </svg>
  );
};

export default QrCode;
