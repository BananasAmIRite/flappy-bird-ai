export default interface Entity {
  getX(): number;
  getY(): number;
  getWidth(): number;
  getHeight(): number;
  render(ctx: CanvasRenderingContext2D): void;
}
