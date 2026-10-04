import rough from 'roughjs';
import type { RectangleRenderer } from '../application/drawingPorts';
export function roughRenderer(): RectangleRenderer {
  const generator = rough.generator();
  return {
    render(rectangle) {
      const { x, y, width, height, style, seed } = rectangle;
      const options = {
        seed,
        roughness: { clean: 0, natural: 1, sketch: 2 }[style.roughness],
        stroke: style.stroke,
        strokeWidth: style.width,
        fill: style.fill === 'transparent' ? undefined : style.fill,
        fillStyle: 'solid',
      };
      const radius = Math.min(width / 4, height / 4, 32);
      const drawable =
        style.corners === 'sharp'
          ? generator.rectangle(x, y, width, height, options)
          : generator.path(
              `M ${x + radius} ${y} H ${x + width - radius} Q ${x + width} ${y} ${x + width} ${y + radius} V ${y + height - radius} Q ${x + width} ${y + height} ${x + width - radius} ${y + height} H ${x + radius} Q ${x} ${y + height} ${x} ${y + height - radius} V ${y + radius} Q ${x} ${y} ${x + radius} ${y} Z`,
              options,
            );
      return generator.toPaths(drawable).map((path) => ({
        ...path,
        fill: path.fill ?? 'none',
        strokeDasharray:
          path.stroke === 'none' || style.line === 'solid'
            ? undefined
            : style.line === 'dashed'
              ? `${style.width * 4} ${style.width * 3}`
              : `${style.width} ${style.width * 3}`,
      }));
    },
  };
}
