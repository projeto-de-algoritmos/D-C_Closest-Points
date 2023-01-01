import { Point } from "./lib";

export type DrawLineEvent = {
  type: "drawLine";
  p1: Point;
  p2: Point;
  label: string;
};

export type CombineEvent = {
  type: "combine";
  x: number;
  y: number;
  p1: Point;
  p2: Point;
  label: string;
  width?: number;
  height?: number;
};

export type HighlightRectEvent = {
  type: "highlightRect";
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type HighlightLeftRightEvent = {
  type: "highlightLeftRight";
  x: number;
  y: number;
  p1Left: Point;
  p2Left: Point;
  labelLeft: string;
  p1Right: Point;
  p2Right: Point;
  labelRight: string;
  width?: number;
  height?: number;
};

export type HighlightStripEvent = {
  type: "highlightStrip";
  x: number;
  y: number;
  p1: Point;
  p2: Point;
  width?: number;
  height?: number;
};

export type HighlightFinishEvent = {
  type: "highlightFinishEvent";
  x: number;
  y: number;
  p1: Point;
  p2: Point;
  label: string;
  width?: number;
  height?: number;
};

export type HighlightResultEvent = {
  type: "highlightResult";
  x: number;
  y: number;
  p1: Point;
  p2: Point;
  label: string;
  width?: number;
  height?: number;
};

export type HighlightPointsEvent = {
  type: "highlightPoints";
  p1: Point;
  p2: Point;
};

export type LibEvent =
  | DrawLineEvent
  | CombineEvent
  | HighlightRectEvent
  | HighlightLeftRightEvent
  | HighlightStripEvent
  | HighlightFinishEvent
  | HighlightResultEvent
  | HighlightPointsEvent;
