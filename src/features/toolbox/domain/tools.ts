export const tools = [
  { id: 'hand', label: 'Hand', shortcut: 'H', icon: 'Hand' },
  { id: 'selection', label: 'Selection', shortcut: 'V', icon: 'MousePointer2' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: 'Square' },
  { id: 'diamond', label: 'Diamond', shortcut: 'D', icon: 'Diamond' },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: 'Circle' },
  { id: 'arrow', label: 'Arrow', shortcut: 'A', icon: 'MoveUpRight' },
  { id: 'line', label: 'Line', shortcut: 'L', icon: 'Minus' },
  { id: 'draw', label: 'Draw', shortcut: 'P', icon: 'Pencil' },
  { id: 'text', label: 'Text', shortcut: 'T', icon: 'Type' },
  { id: 'note', label: 'Note', shortcut: 'N', icon: 'StickyNote' },
  { id: 'image', label: 'Image', shortcut: 'I', icon: 'Image' },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', icon: 'Eraser' },
  { id: 'frame', label: 'Frame', shortcut: 'F', icon: 'Frame' },
  { id: 'laser', label: 'Laser pointer', shortcut: 'K', icon: 'Sparkles' },
] as const;
export type ToolId = (typeof tools)[number]['id'];
export type DraftStyle = {
  readonly stroke: string;
  readonly fill: string;
  readonly width: 1 | 2 | 4;
  readonly line: 'solid' | 'dashed' | 'dotted';
  readonly roughness: 'clean' | 'natural' | 'sketch';
  readonly opacity: number;
  readonly corners: 'round' | 'sharp';
};
export const initialStyle: DraftStyle = {
  stroke: '#1e1e1e',
  fill: 'transparent',
  width: 2,
  line: 'solid',
  roughness: 'natural',
  opacity: 100,
  corners: 'round',
};
export function toolForShortcut(key: string): ToolId | undefined {
  return tools.find((tool) => tool.shortcut.toLowerCase() === key.toLowerCase())
    ?.id;
}
