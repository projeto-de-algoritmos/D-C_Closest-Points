import { LibEvent } from "./events";

export type Point = {
  x: number;
  y: number;
};

export type DistanceInfo = [number, Point, Point];

export class ClosestPair {
  private _events: LibEvent[] = [];
  private n?: number;

  get events(): LibEvent[] {
    return this._events;
  }

  public conquer(points: Point[]): DistanceInfo {
    points.sort((a, b) => a.x - b.x);
    this.n = points.length;
    this._events = [];

    const result = this.closest(points);
    this._events.push({
      type: "highlightPoints",
      p1: result[1],
      p2: result[2],
    });

    return result;
  }

  public bruteForce(points: Point[]): DistanceInfo {
    const pairs = points.flatMap((v, i) =>
      points
        .slice(i + 1)
        .map((w) => [this.distance([v, w]), v, w] as DistanceInfo)
    );

    return pairs.reduce((p, c) => (c[0] < p[0] ? c : p));
  }

  private closest(points: Point[]): DistanceInfo {
    this._events.push({
      type: "highlightRect",
      x: points[0].x - 6,
      y: 0,
      width: points.at(-1)!.x - points[0].x + 12,
    });

    if (points.length <= 3) {
      const brute = this.bruteForce(points);
      this._events.push({
        type: "drawLine",
        p1: brute[1],
        p2: brute[2],
        label: "d",
      });
      return brute;
    }

    const middle = Math.floor(points.length / 2);
    const middlePoint = points[middle];

    const leftDist = this.closest(points.slice(0, middle));
    const rightDist = this.closest(points.slice(middle));

    this._events.push({
      type: "highlightLeftRight",
      x: points[0].x - 6,
      y: 0,
      width: points.at(-1)!.x - points[0].x + 12,
      p1Left: leftDist[1],
      p2Left: leftDist[2],
      labelLeft: "dl",
      p1Right: rightDist[1],
      p2Right: rightDist[2],
      labelRight: "dr",
    });

    const dist = leftDist[0] < rightDist[0] ? leftDist : rightDist;

    this._events.push({
      type: "combine",
      x: points[0].x - 6,
      y: 0,
      width: points.at(-1)!.x - points[0].x + 12,
      p1: dist[1],
      p2: dist[2],
      label: "d",
    });

    const strip = points.filter(
      (p) =>
        Math.abs(p.x - middlePoint.x) < dist[0] &&
        p.x >= points[0].x &&
        p.x <= points.at(-1)!.x
    );

    this._events.push({
      type: "highlightStrip",
      x: Math.max(points[0].x - 6, middlePoint.x - dist[0] - 6),
      y: 0,
      width: Math.min(
        points.at(-1)!.x - Math.max(points[0].x, middlePoint.x - dist[0] - 6),
        2 * dist[0] + 12
      ),
      p1: dist[1],
      p2: dist[2],
    });

    const stripDist = this.minimumDistanceStrip(strip, dist[0]);

    const result = stripDist[0] < dist[0] ? stripDist : dist;

    this._events.push({
      type:
        points.length === this.n ? "highlightFinishEvent" : "highlightResult",
      x: points[0].x - 6,
      y: 0,
      width: points.at(-1)!.x - points[0].x + 12,
      p1: result[1],
      p2: result[2],
      label: "d",
    });

    return result;
  }

  private minimumDistanceStrip(strip: Point[], distance: number): DistanceInfo {
    let minDist = distance;
    strip.sort((a, b) => a.y - b.y);

    let p1: Point;
    let p2: Point;

    for (let i = 0; i < strip.length; i++) {
      for (
        let j = i + 1;
        j < strip.length && strip[j].y - strip[i].y < distance;
        j++
      ) {
        if (this.distance([strip[i], strip[j]]) < minDist) {
          minDist = this.distance([strip[i], strip[j]]);
          p1 = strip[i];
          p2 = strip[j];
          this._events.push({
            type: "highlightPoints",
            p1: strip[i],
            p2: strip[j],
          });
        }
      }
    }

    return [minDist, p1!, p2!];
  }

  private distance(p: [Point, Point]): number {
    return Math.pow(p[0].x - p[1].x, 2) + Math.pow(p[0].y - p[1].y, 2);
  }
}
