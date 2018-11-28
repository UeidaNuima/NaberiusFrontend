import * as React from 'react';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import { PLAYER_DOT_URL } from '../../consts';

interface DotAnimationSingleEntryProps {
  dot: any;
  image: string;
  EntryID: number;
}

interface DotAnimationSingleEntryStates {
  currentFrame: number;
}

class DotAnimationSingleEntry extends React.Component<
  DotAnimationSingleEntryProps,
  DotAnimationSingleEntryStates
> {
  public app: PIXI.Application;
  public div: HTMLDivElement | null;
  public state = {
    currentFrame: 0,
  };
  public componentDidMount() {
    let maxWidth = 0;
    let maxHeight = 0;
    let maxOriginX = 0;
    let maxOriginY = 0;
    this.props.dot.Entries[this.props.EntryID].Sprites.forEach(
      (sprite: any) => {
        if (sprite.Width + maxOriginX > maxWidth) {
          maxWidth = sprite.Width + maxOriginX;
        }
        if (sprite.Height + maxOriginY > maxHeight) {
          maxHeight = sprite.Height + maxOriginY;
        }
        if (sprite.OriginX > maxOriginX) {
          maxOriginX = sprite.OriginX;
        }
        if (sprite.OriginY > maxOriginY) {
          maxOriginY = sprite.OriginY;
        }
      },
    );
    const options: any = {
      width: Math.min(maxWidth, 200),
      height: Math.min(maxHeight, 200),
      backgroundColor: 0xffffff,
    };
    this.app = new PIXI.Application(options);
    PIXI.loader
      .reset()
      .add(this.props.image)
      .load(() => {
        const texture = PIXI.loader.resources[this.props.image].texture;

        const frames: PIXI.Texture[] = [];

        this.props.dot.Entries[this.props.EntryID].Sprites.forEach(
          (sprite: any) => {
            const frame = new PIXI.Rectangle(
              sprite.X,
              sprite.Y,
              sprite.Width,
              sprite.Height,
            );

            const trim = new PIXI.Rectangle(
              -sprite.OriginX,
              -sprite.OriginY,
              sprite.Width,
              sprite.Height,
            );

            frames.push(
              new PIXI.Texture(texture.baseTexture, frame, undefined, trim),
            );
          },
        );
        const animateFrames: PIXI.Texture[] = [];
        let j = 0;
        for (let i = 0; i <= this.props.dot.Length; i++) {
          const pattern: any = _.find(
            this.props.dot.Entries[this.props.EntryID].PatternNo,
            {
              Time: i,
            },
          );
          if (pattern) {
            j = pattern.Data;
          }
          animateFrames.push(frames[j]);
        }

        const anim = new PIXI.extras.AnimatedSprite(animateFrames);

        anim.x = maxOriginX;
        anim.y = maxOriginY;
        anim.anchor.set(0);
        anim.animationSpeed = 1;
        anim.play();

        anim.onFrameChange = () => {
          this.setState({ currentFrame: anim.currentFrame });
        };

        this.app.stage.interactive = true;
        this.app.stage.buttonMode = true;
        this.app.stage.hitArea = new PIXI.Rectangle(
          0,
          0,
          this.app.screen.width,
          this.app.screen.height,
        );

        this.app.stage.on('click', () => {
          if (anim.playing) {
            anim.stop();
          } else {
            anim.play();
          }
        });

        this.app.stage.addChild(anim);
      });
    if (this.div) {
      this.div.appendChild(this.app.view);
    }
  }
  public componentWillUnmount() {
    this.app.destroy();
    console.log('destroyed');
  }
  public render() {
    return (
      <div
        style={{
          display: 'inline-block',
        }}
      >
        <div ref={ref => (this.div = ref)} />
        <span>{this.state.currentFrame}</span>f/
        <span>{this.props.dot.Length}</span>f
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
            EntryID={index}
          />
        ))}
      </div>
    );
  }
}
