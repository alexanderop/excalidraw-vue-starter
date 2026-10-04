export type ShapeStyle = {
  readonly stroke: string;
  readonly fill: string;
  readonly width: 1 | 2 | 4;
  readonly line: 'solid' | 'dashed' | 'dotted';
  readonly roughness: 'clean' | 'natural' | 'sketch';
  readonly opacity: number;
  readonly corners: 'round' | 'sharp';
};
