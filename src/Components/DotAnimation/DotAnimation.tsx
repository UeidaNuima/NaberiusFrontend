import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import * as GIF from 'gif.js';
import { PLAYER_DOT_URL } from '../../consts';

interface DotAnimationSingleEntryProps {
  dot: any;
  image: string;
  EntryID: number;
  cardID: number;
}

const DotAnimationSingleEntry: React.FC<DotAnimationSingleEntryProps> = ({
  dot,
  image,
  EntryID,
  cardID,
}) => {
  const canvas = useRef<HTMLCanvasElement>();
  const gif = useRef<any>();
  useEffect(() => {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let blankWidth = 99999;
    let blankHeight = 99999;
    const tickNum: number = dot.Length;
    interface Sprite {
      X: number;
      Y: number;
      Width: number;
      Height: number;
      OriginX: number;
      OriginY: number;
    }
    const sprites: Sprite[] = dot.Entries[EntryID].Sprites.map(
      (sprite: any) => ({
        X: sprite.X,
        Y: sprite.Y,
        Width: sprite.Width,
        Height: sprite.Height,
        OriginX: sprite.OriginX > 1000 ? 0 : sprite.OriginX,
        OriginY: sprite.OriginY > 1000 ? 0 : sprite.OriginY,
      }),
    );

    // map sprite to frames
    let frames: Array<{
      Sprite: Sprite;
      Time: number;
    }> = dot.Entries[EntryID].PatternNo.map((pat: any) => {
      return { Sprite: sprites[pat.Data], Time: pat.Time };
    });

    // get frame length
    frames = frames
      .map((pat, index) => ({
        ...pat,
        Time:
          index === frames.length - 1
            ? tickNum - pat.Time
            : frames[index + 1].Time - pat.Time,
      }))
      .filter(pat => pat.Time !== 0);

    // count the container size of images
    sprites.forEach(sprite => {
      left = Math.max(left, sprite.OriginX);
      right = Math.min(right, sprite.OriginX - sprite.Width);

      top = Math.max(top, sprite.OriginY);
      bottom = Math.min(bottom, sprite.OriginY - sprite.Height);
    });
    canvasWidth = left - right;
    canvasHeight = top - bottom;

    // count the top-left blank block size
    sprites.forEach(sprite => {
      blankWidth = Math.min(blankWidth, canvasWidth - sprite.OriginX);
      blankHeight = Math.min(blankHeight, canvasHeight - sprite.OriginY);
    });
    canvas.current!.width = canvasWidth;
    canvas.current!.height = canvasHeight;

    // use #08D422 as transparent color
    // just a random color
    gif.current = new GIF({
      workers: 2,
      quality: 1,
      workerScript: '/gif.worker.js',
      width: canvasWidth,
      height: canvasHeight,
      background: '#08D422',
      transparent: '0x08D422',
    });

    // load image
    const imageObj = new Image();
    imageObj.crossOrigin = 'anonymous';
    imageObj.src = image;
    const ctx = canvas.current!.getContext('2d') as CanvasRenderingContext2D;

    let currentTick = 0;
    let currentFrame = -1;

    let gifStatus = true;

    const imageLoop = () => {
      // request next tick
      window.requestAnimationFrame(imageLoop);
      let frameChanged = false;
      // when tick goes 0, shift to next frame
      if (currentTick === 0) {
        currentFrame += 1;
        frameChanged = true;
        if (currentFrame === frames.length) {
          currentFrame = 0;
          gifStatus = false;
        }
        // set tick to frame length
        currentTick = frames[currentFrame].Time;
      }
      // minus in every tick
      currentTick--;
      // draw the sprite
      const sprite = frames[currentFrame].Sprite;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(
        imageObj,
        sprite.X,
        sprite.Y,
        sprite.Width,
        sprite.Height,
        canvasWidth - sprite.OriginX - blankWidth,
        canvasHeight - sprite.OriginY - blankHeight,
        sprite.Width,
        sprite.Height,
      );
      if (gifStatus && frameChanged) {
        // copy canvas image to a temp canvas and add background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.height = canvasHeight;
        tempCanvas.width = canvasWidth;
        const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        // fill the 'transparent' background
        tempCtx.fillStyle = '#08D422';
        tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
        tempCtx.drawImage(canvas.current!, 0, 0);
        gif.current!.addFrame(tempCtx, {
          copy: true,
          delay: frames[currentFrame].Time * (1000 / 60),
        });
      }
    };

    imageObj.onload = imageLoop;
    return () => {
      const cv = canvas.current!;
      const context = cv.getContext('2d')!;
      context.clearRect(0, 0, cv.width, cv.height);
    };
  }, [EntryID, dot, image]);

  return (
    <div>
      <Tooltip title="点击下载gif">
        <canvas
          onClick={() => {
            gif.current.on('finished', (blob: Blob) => {
              // crate a anchor
              const url: string = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.style.display = 'none';
              a.download = `${cardID}-${dot.Name}-${EntryID}.gif`;
              // and click it
              a.click();
            });
            gif.current.render();
          }}
          style={{ cursor: 'pointer' }}
          ref={ref => ref && (canvas.current = ref)}
        />
      </Tooltip>
    </div>
  );
};

interface DotAnimationProps {
  dot: any;
  cardID: number;
}

const DotAnimation: React.FC<DotAnimationProps> = ({ dot, cardID }) => {
  return (
    <div>
      {dot.Entries.map((entry: any, index: number) => (
        <DotAnimationSingleEntry
          key={entry.Name}
          dot={dot}
          image={PLAYER_DOT_URL + `/${cardID}.png`}
          cardID={cardID}
          EntryID={index}
        />
      ))}
    </div>
  );
};

export default DotAnimation;
