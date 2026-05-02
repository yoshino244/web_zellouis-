export function getContrastColor(cssColor: string): string {
  // If it's empty, default to black
  if (!cssColor) return 'black';

  // Basic check for common named colors used in tailwind/html
  const namedDarkColors = ['black', 'navy', 'darkblue', 'darkgreen', 'darkred', 'maroon', 'purple', 'indigo', 'darkslategray'];
  const namedLightColors = ['white', 'yellow', 'silver', 'cyan', 'lime', 'lightgray', 'orange', 'pink'];

  const lower = cssColor.toLowerCase().trim();
  if (namedDarkColors.includes(lower)) return 'white';
  if (namedLightColors.includes(lower)) return 'black';

  let r = 0, g = 0, b = 0;

  // Hex color
  if (lower.startsWith('#')) {
    let hex = lower.substring(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } 
  // RGB / RGBA color
  else if (lower.startsWith('rgb')) {
    const match = lower.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    }
  } 
  // HSL color (rough approximation)
  else if (lower.startsWith('hsl')) {
    const match = lower.match(/hsla?\(\d+,\s*\d+%?,\s*(\d+)%?/);
    if (match) {
      const lightness = parseInt(match[1]);
      return lightness > 50 ? 'black' : 'white';
    }
  }

  // Calculate luminance
  // Standard formula for perceived brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  
  return luminance > 150 ? 'black' : 'white';
}
