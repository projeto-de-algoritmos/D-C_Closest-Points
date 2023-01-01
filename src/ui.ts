import { LibEvent } from "./events";
import { ClosestPair, DistanceInfo, Point } from "./lib";

const colors = {
  point: "#4E9Af1",
  label: "#0E0A19",
  highlight: "#0000FF",
  black: "#000000",
  red: "#FF0000",
  yellow: "#fef36F",
  green: "#4caf50",
  gray: "#c7c4c0",
};

export type CustomUIEvent = {
  canGoNext: boolean;
  points: Point[];
  currentEvent?: LibEvent;
  distanceInfo?: DistanceInfo;
};

export class UI {
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [];
  private solver = new ClosestPair();
  private distanceInfo?: DistanceInfo;
  private eventIndex: number = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private pointSize: number = 7
  ) {
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      throw new Error(
        "Canvas doest not contain a 2d context. Something went very wrong"
      );
    }

    this.ctx = ctx;

    this.canvas.addEventListener("click", (e: MouseEvent) =>
      this.drawPointOnClick(e)
    );
  }

  public generateRandom(length: number) {
    this.reset();

    this.points = Array.from({ length }, () => ({
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height),
    }));

    this.points.forEach((p) => this.drawPoint(p));
  }

  public reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.points = [];
    this.solver = new ClosestPair();
    this.eventIndex = 0;
    this.distanceInfo = undefined;

    this.dispatch();
  }

  public solve() {
    if (this.points.length >= 2) {
      this.distanceInfo = this.solver.conquer(this.points);
    }
  }

  public canGoNext(): boolean {
    return this.eventIndex < this.solver.events.length - 1;
  }

  public next() {
    this.eventIndex++;
    this.drawEvent(this.solver.events[this.eventIndex]);
    this.dispatch();
  }

  private dispatch() {
    window.dispatchEvent(
      new CustomEvent<CustomUIEvent>("step", {
        detail: {
          canGoNext: this.canGoNext(),
          points: this.points,
          currentEvent: this.solver.events[this.eventIndex],
          distanceInfo: this.distanceInfo,
        },
      })
    );
  }

  private drawEvent(e: LibEvent) {
    switch (e.type) {
      case "highlightRect":
        this.highlightRect(
          e.x,
          e.y,
          e.width ?? this.canvas.width,
          e.height ?? this.canvas.height,
          colors.yellow
        );
        break;
      case "drawLine":
        this.drawLine(e.p1, e.p2);
        this.drawLabel(e.label, e.p1, e.p2);
        break;
      case "highlightPoints":
        this.highlightPoint(e.p1, colors.red);
        this.highlightPoint(e.p2, colors.red);
        break;
      case "combine":
        this.highlightRect(
          e.x,
          e.y,
          e.width ?? this.canvas.width,
          e.height ?? this.canvas.height,
          colors.yellow
        );
        this.drawLine(e.p1, e.p2);
        this.drawLabel(e.label, e.p1, e.p2);
        break;
      case "highlightStrip":
        this.highlightRect(
          e.x,
          e.y,
          e.width ?? this.canvas.width,
          e.height ?? this.canvas.height,
          colors.green
        );
        this.drawLine(e.p1, e.p2);
        break;
      case "highlightResult":
        this.highlightRect(
          e.x,
          e.y,
          e.width ?? this.canvas.width,
          e.height ?? this.canvas.height,
          colors.yellow
        );
        this.drawLine(e.p1, e.p2);
        this.drawLabel(e.label, e.p1, e.p2);
        break;
      case "highlightLeftRight":
        this.highlightRect(
          e.x,
          e.y,
          e.width ?? this.canvas.width,
          e.height ?? this.canvas.height,
          colors.yellow
        );
        this.drawLine(e.p1Left, e.p2Left);
        this.drawLabel(e.labelLeft, e.p1Left, e.p2Left);
        this.drawLine(e.p1Right, e.p2Right);
        this.drawLabel(e.labelRight, e.p1Right, e.p2Right);
        break;
      case "highlightFinishEvent":
        this.highlightRect(
          0,
          0,
          this.canvas.width,
          this.canvas.height,
          colors.gray
        );
        this.drawLine(e.p1, e.p2);
        this.drawLabel(e.label, e.p1, e.p2);
        break;
    }
  }

  private drawPoint(p: Point) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, this.pointSize, 0, Math.PI * 2);

    this.ctx.fillStyle = colors.point;
    this.ctx.fill();

    this.ctx.strokeStyle = colors.black;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawLine(p1: Point, p2: Point) {
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.restore();

    this.points.forEach((p) => this.drawPoint(p));
  }

  private drawLabel(text: string, p1: Point, p2: Point) {
    if (p1.x > p2.x) {
      [p1, p2] = [p2, p1];
    }

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const pad = 0.5;

    this.ctx.save();

    this.ctx.textAlign = "center";
    this.ctx.fillStyle = colors.label;
    this.ctx.font = "bold 17px Arial";
    this.ctx.translate(p1.x + dx * pad, p1.y + dy * pad);
    this.ctx.rotate(Math.atan2(dy, dx));
    this.ctx.fillText(text, 0, 0);

    this.ctx.restore();
  }

  private highlightPoint(p: Point, color: string) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, this.pointSize, 0, Math.PI * 2);

    this.ctx.fillStyle = colors.highlight;
    this.ctx.fill();

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.restore();
  }

  private highlightRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.ctx.save();

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeRect(x, y, width, height);

    this.ctx.restore();

    this.points.forEach((p) => this.drawPoint(p));
  }

  private drawPointOnClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;

    this.drawPoint({ x, y });
    this.points.push({ x, y });
  }
}
