import React, { useRef, useEffect, useState } from 'react';
import { Quest } from 'interfaces';
import { STATIC_URL } from 'consts';
import { Stage, Layer, Image, Circle, Arrow } from 'react-konva';
import useImage from 'use-image';
import styles from './Quest.module.less';
import { InputNumber, Select } from 'antd';

const MapTable: React.FC<{ quest: Quest }> = ({ quest }) => {
  const [mapImg] = useImage(
    'http://assets.millennium-war.net' + quest.Map.Image,
  );
  const [heartImg] = useImage(STATIC_URL + '/heart.png');
  const [nearImg] = useImage(STATIC_URL + '/near.png');
  const [farImg] = useImage(STATIC_URL + '/far.png');
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [circle, setCircle] = useState<{
    x?: number;
    y?: number;
    range?: number;
  }>({});
  const [routeNos, setRouteNos] = useState<number[]>([]);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setZoom(containerRef.current.offsetWidth / 960);
      }
    };
    window.onresize = resize;
    resize();
    return () => {
      window.onresize = null;
    };
  }, []);

  // const routeNosAppend = [...routeNos];
  // for (let i = 0; i < routeNosAppend.length; i++) {
  //   const routes = quest.Map.Routes[routeNosAppend[i]];
  //   for (const route of routes) {
  //     if (route.RouteID !== 0 && !routeNosAppend.includes(route.RouteID)) {
  //       routeNosAppend.push(route.RouteID);
  //       break;
  //     }
  //   }
  // }

  return (
    <>
      <div
        style={{
          width: '100%',
          height: 0,
          paddingBottom: '66.67%',
          overflow: 'hidden',
        }}
        ref={containerRef}
      >
        <Stage width={960} height={640} scaleX={zoom} scaleY={zoom}>
          <Layer>
            <Image image={mapImg} />
            {mapImg && heartImg && nearImg && farImg && (
              <>
                <Image image={mapImg} />
                {quest.Map.Locations[quest.LocationNo].map(
                  (location, index) => {
                    const img =
                      location.ObjectID === 0
                        ? heartImg
                        : location.ObjectID < 300
                        ? nearImg
                        : farImg;
                    if (location.ObjectID === 0) {
                      return (
                        <Image
                          image={img}
                          key={index}
                          x={location.X - img.width / 2}
                          y={location.Y - img.height / 2}
                        />
                      );
                    }
                    return (
                      <Image
                        onClick={() => {
                          setCircle(c => ({
                            x: location.X,
                            y: location.Y,
                            range: c.range || 250,
                          }));
                        }}
                        onTap={() => {
                          setCircle(c => ({
                            x: location.X,
                            y: location.Y,
                            range: c.range || 250,
                          }));
                        }}
                        onMouseEnter={() => {
                          document.body.style.cursor = 'pointer';
                        }}
                        onMouseLeave={() => {
                          document.body.style.cursor = 'default';
                        }}
                        image={img}
                        key={index}
                        x={location.X - img.width / 2}
                        y={location.Y - img.height / 3}
                      />
                    );
                  },
                )}
                {circle.range !== undefined &&
                  circle.x !== undefined &&
                  circle.y !== undefined && (
                    <Circle
                      radius={circle.range * 0.75}
                      x={circle.x}
                      y={circle.y}
                      fill="rgba(0, 255, 0, 0.3)"
                      stroke="rgba(0, 255, 0, 0.5)"
                      onClick={() => setCircle({})}
                      onTap={() => setCircle({})}
                    />
                  )}
                {quest.Map.Routes.map((routes, index) => {
                  if (!routeNos.includes(index)) {
                    return null;
                  }
                  return (
                    <React.Fragment key={index}>
                      {routes.slice(1).map((route, i) => {
                        return (
                          <Arrow
                            points={[
                              routes[i].X,
                              routes[i].Y,
                              route.X,
                              route.Y,
                            ]}
                            key={i}
                            stroke="rgba(255, 255, 255, 0.7)"
                            fill="red"
                            strokeWidth={8}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </Layer>
        </Stage>
      </div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>射程圈</th>
            <td>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={circle.range}
                onChange={value =>
                  value &&
                  value >= 0 &&
                  setCircle(c => ({ ...c, range: value && value }))
                }
                placeholder="点一下上图里的配置位"
              />
            </td>
          </tr>
          <tr>
            <th>路径</th>
            <td>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={routeNos}
                onChange={(value: number[]) => setRouteNos(value)}
                placeholder="选择路径"
              >
                {quest.Map.Routes.map(
                  (route, index) =>
                    route && (
                      <Select.Option key={index} value={index}>
                        {index}
                      </Select.Option>
                    ),
                )}
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default MapTable;
