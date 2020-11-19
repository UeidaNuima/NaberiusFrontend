import { Dot, Frame } from './interfaces';

export class DefaultGetter {
  private obj: any;
  public constructor(obj: any) {
    this.obj = obj;
  }
  public get(index: string | number) {
    if (index in this.obj) {
      return this.obj[index];
    } else {
      return index.toString();
    }
  }
}

// random choose a item from a array
export function choose<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function renderDescription(source: string) {
  return (
    '<span>' +
    source
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/%c\[(.{6})\]/g, '</span><span style="color: #$1">')
      .replace(/\n/g, '<br />') +
    '</span>'
  );
}

function range(min: number, max: number, length: number) {
  if (length === 1) return [min];
  const res: number[] = [];
  const gap = (max - min) / (length - 1);
  let current = min;
  while (length !== 0) {
    res.push(current);
    current += gap;
    length--;
  }
  return res;
}

export function generateTimelines(dots: Dot) {
  const timelines: Frame[][] = [];
  const frameNum = dots.Length;
  for (const entry of dots.Entries) {
    if (!entry.Sprites) {
      continue
    }
    const timeline: Frame[] = [];
    let patternPos = 0;
    for (let t = 0; t <= frameNum; t++) {
      const pattern = entry.PatternNo[patternPos];
      const prevFrame = timeline[timeline.length - 1];
      const frame: Frame = {
        Sprite: prevFrame
          ? { ...prevFrame.Sprite }
          : {
              X: 0,
              Y: 0,
              Width: 0,
              Height: 0,
              OriginX: 0,
              OriginY: 0,
              ParsedX: 0,
              ParsedY: 0,
            },
        Alpha: 1,
        Pos: { X: 0, Y: 0 },
        Scale: { X: 1, Y: 1 },
      };

      if (
        pattern &&
        (pattern.Time === t ||
          pattern.Time === undefined ||
          pattern.Time === null)
      ) {
        frame.Sprite = {
          ...entry.Sprites[pattern.Data],
          ParsedX: 0,
          ParsedY: 0,
        };
        patternPos++;
      }

      timeline.push(frame);
      if (pattern && pattern.Time === undefined) break;
    }

    if (entry.Alpha) {
      for (let alphaPos = 0; alphaPos < entry.Alpha.length - 1; alphaPos++) {
        const prevAlpha = entry.Alpha[alphaPos];
        const nextAlpha = entry.Alpha[alphaPos + 1];
        const alphas = range(
          prevAlpha.Data,
          nextAlpha.Data,
          nextAlpha.Time - prevAlpha.Time + 1,
        );
        for (let t = prevAlpha.Time; t <= nextAlpha.Time; t++) {
          timeline[t].Alpha = alphas[t - prevAlpha.Time];
        }
      }
      if (entry.Alpha.length === 1) {
        for (const frame of timeline) {
          frame.Alpha = entry.Alpha[0].Data;
        }
      }
    }

    if (entry.Pos) {
      for (let posPos = 0; posPos < entry.Pos.length - 1; posPos++) {
        const prevPos = entry.Pos[posPos];
        const nextPos = entry.Pos[posPos + 1];
        const posesX = range(
          prevPos.Data.X,
          nextPos.Data.X,
          nextPos.Time - prevPos.Time + 1,
        );
        const posesY = range(
          prevPos.Data.Y,
          nextPos.Data.Y,
          nextPos.Time - prevPos.Time + 1,
        );

        for (let t = prevPos.Time; t <= nextPos.Time; t++) {
          timeline[t].Pos.X = posesX[t - prevPos.Time];
          timeline[t].Pos.Y = posesY[t - prevPos.Time];
        }
      }

      if (entry.Pos.length === 1) {
        for (const frame of timeline) {
          frame.Pos = { ...entry.Pos[0].Data };
        }
      }
    }

    if (entry.Scale) {
      for (let scalePos = 0; scalePos < entry.Scale.length - 1; scalePos++) {
        const prevScale = entry.Scale[scalePos];
        const nextScale = entry.Scale[scalePos + 1];
        const scalesX = range(
          prevScale.Data.X,
          nextScale.Data.X,
          nextScale.Time - prevScale.Time + 1,
        );
        const scalesY = range(
          prevScale.Data.Y,
          nextScale.Data.Y,
          nextScale.Time - prevScale.Time + 1,
        );

        for (let t = prevScale.Time; t <= nextScale.Time; t++) {
          timeline[t].Scale.X = scalesX[t - prevScale.Time];
          timeline[t].Scale.Y = scalesY[t - prevScale.Time];
        }
      }
      if (entry.Scale.length === 1) {
        for (const frame of timeline) {
          frame.Scale = { ...entry.Scale[0].Data };
        }
      }
    }

    timelines.push(timeline);
  }

  timelines.forEach(timeline =>
    timeline.forEach(frame => {
      frame.Sprite.ParsedX =
        frame.Sprite.OriginX -
        frame.Pos.X +
        (frame.Sprite.Width / 2) * (frame.Scale.X - 1);
      frame.Sprite.ParsedY =
        frame.Sprite.OriginY -
        frame.Pos.Y +
        frame.Sprite.Height * (frame.Scale.Y - 1);
    }),
  );

  return timelines;
}
