import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import { PLAYER_DOT_URL, ENEMY_DOT_URL } from '../../consts';
import { Dot } from '../../interfaces';
import { generateTimelines } from '../../utils';
import * as GIF from 'gif.js';

interface DotAnimationProps {
  dot: Dot;
  CardID: number;
  type: 'Player' | 'Enemy';
}

const DotAnimation: React.FC<DotAnimationProps> = ({ dot, CardID, type }) => {
  const canvas = useRef<HTMLCanvasElement>();
  // const tempCanvas = useRef<HTMLCanvasElement>();
  const gif = useRef<any>();
  useEffect(() => {
    let top = 0;
    let bottom = 65536;
    let left = 0;
    let right = 65536;
    let canvasWidth = 0;
    let canvasHeight = 0;
    const tickNum: number = dot.Length;

    const timelines = generateTimelines(dot);

    console.log(timelines);

    timelines.forEach(timeline => {
      timeline.forEach(frame => {
        left = Math.max(left, frame.Sprite.ParsedX);
        right = Math.min(
          right,
          frame.Sprite.ParsedX - frame.Sprite.Width * frame.Scale.X,
        );

        top = Math.max(top, frame.Sprite.ParsedY);
        bottom = Math.min(
          bottom,
          frame.Sprite.ParsedY - frame.Sprite.Height * frame.Scale.Y,
        );
      });
    });

    canvasWidth = left - right;
    canvasHeight = top - bottom;

    canvas.current!.width = canvasWidth;
    canvas.current!.height = canvasHeight;

    // load image
    const imageObj = new Image();
    imageObj.crossOrigin = 'anonymous';
    imageObj.src = `${
      type === 'Player' ? PLAYER_DOT_URL : ENEMY_DOT_URL
    }/${CardID}/sprite.png`;

    const ctx = canvas.current!.getContext('2d') as CanvasRenderingContext2D;

    let currentTick = 0;

    gif.current = new GIF({
      workers: 2,
      quality: 1,
      workerScript: '/gif.worker.js',
      width: canvasWidth,
      height: canvasHeight,
      transparent: 'rgba(0,0,0,0)',
    }).on('finished', (blob: Blob) => {
      // crate a anchor
      const url: string = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.style.display = 'none';
      a.download = `${CardID}-${dot.Name}.gif`;
      // and click it
      a.click();
    });

    let gifStatus = true;
    let frameId: number | undefined;
    const imageLoop = () => {
      // request next tick
      if (timelines.length !== 0 && timelines[0].length !== 1)
        frameId = window.requestAnimationFrame(imageLoop);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      timelines.forEach(timeline => {
        const frame = timeline[currentTick];
        const sprite = frame.Sprite;
        // set alpha
        ctx.globalAlpha = frame.Alpha;
        // draw image
        ctx.drawImage(
          imageObj,
          sprite.X,
          sprite.Y,
          sprite.Width,
          sprite.Height,
          left - sprite.ParsedX,
          top - sprite.ParsedY,
          sprite.Width * frame.Scale.X,
          sprite.Height * frame.Scale.Y,
        );
        // restore alpha
        ctx.globalAlpha = 1;
      });

      if (gifStatus && currentTick % 2 === 0) {
        gif.current!.addFrame(ctx, {
          copy: true,
          delay: 1000 / 30,
        });
      }

      currentTick++;

      if (currentTick > tickNum) {
        currentTick = 0;
        gifStatus = false;
      }
    };

    imageObj.onload = imageLoop;

    return () => {
      const cv = canvas.current!;
      const context = cv.getContext('2d')!;
      context.clearRect(0, 0, cv.width, cv.height);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      imageObj.onload = null;
      gif.current = null;
    };
  }, [dot, CardID, type]);

  return (
    <div>
      <Tooltip title="点击下载gif">
        <canvas
          ref={ref => ref && (canvas.current = ref)}
          onClick={() => {
            gif.current.render();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default DotAnimation;
