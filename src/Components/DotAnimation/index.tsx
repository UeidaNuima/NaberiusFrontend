import * as React from 'react';
import { Tooltip } from 'antd';
import * as GIF from 'gif.js';
import _ from 'lodash';
import { PLAYER_DOT_URL } from '../../consts';

interface DotAnimationSingleEntryProps {
  dot: any;
  image: string;
  EntryID: number;
  cardID: number;
}

class DotAnimationSingleEntry extends React.Component<
  DotAnimationSingleEntryProps
> {
  public canvas?: HTMLCanvasElement;
  public gif: any;
  public componentDidMount() {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let blankWidth = 99999;
    let blankHeight = 99999;
    const tickNum: number = this.props.dot.Length;
    interface Sprite {
      X: number;
      Y: number;
      Width: number;
      Height: number;
      OriginX: number;
      OriginY: number;
    }
    const sprites: Sprite[] = this.props.dot.Entries[
      this.props.EntryID
    ].Sprites.map((sprite: any) => ({
      X: sprite.X,
      Y: sprite.Y,
      Width: sprite.Width,
      Height: sprite.Height,
      OriginX: sprite.OriginX > 1000 ? 0 : sprite.OriginX,
      OriginY: sprite.OriginY > 1000 ? 0 : sprite.OriginY,
    }));

    // map sprite to frames
    let frames: Array<{
      Sprite: Sprite;
      Time: number;
    }> = this.props.dot.Entries[this.props.EntryID].PatternNo.map(
      (pat: any) => {
        return { Sprite: sprites[pat.Data], Time: pat.Time };
      },
    );

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
    this.canvas!.width = canvasWidth;
    this.canvas!.height = canvasHeight;

    // use #08D422 as transparent color
    // just a random color
    this.gif = new GIF({
      workers: 2,
      quality: 1,
      workerScript: '/gif.worker.js',
      width: canvasWidth,
      height: canvasHeight,
      background: '#08D422',
      transparent: '0x08D422',
    });

    // load image
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = this.props.image;
    const ctx = this.canvas!.getContext('2d') as CanvasRenderingContext2D;

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
        image,
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
        tempCtx.drawImage(this.canvas!, 0, 0);
        this.gif.addFrame(tempCtx, {
          copy: true,
          delay: frames[currentFrame].Time * (1000 / 60),
        });
      }
    };

    image.onload = imageLoop;
  }

  public render() {
    return (
      <div>
        <Tooltip title="点击下载gif">
          <canvas
            onClick={() => {
              this.gif.on('finished', (blob: Blob) => {
                // crate a anchor
                const url: string = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.style.display = 'none';
                a.download = `${this.props.cardID}-${this.props.dot.Name}-${
                  this.props.EntryID
                }.gif`;
                // and click it
                a.click();
              });
              this.gif.render();
            }}
            style={{ cursor: 'pointer' }}
            ref={ref => ref && (this.canvas = ref)}
          />
        </Tooltip>
      </div>
    );
  }
}

interface DotAnimationProps {
  dot: any;
  cardID: number;
}

export default class DotAnimation extends React.Component<DotAnimationProps> {
  public render() {
    return (
      <div>
        {this.props.dot.Entries.map((entry: any, index: number) => (
          <DotAnimationSingleEntry
            key={entry.Name}
            dot={this.props.dot}
            image={PLAYER_DOT_URL + `/${this.props.cardID}.png`}
            cardID={this.props.cardID}
            EntryID={index}
          />
        ))}
      </div>
    );
  }
}
