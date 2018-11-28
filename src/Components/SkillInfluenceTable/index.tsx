import * as React from 'react';

const SkillInfluenceTable = ({ skill, influences }: any) => (
  <div className="ant-table ant-table-bordered ant-table-middle">
    <div className="ant-table-content">
      <div className="ant-table-body">
        <table>
          <thead className="ant-table-thead">
            <tr>
              <th>类型</th>
              <th>効果%</th>
              <th>差分%</th>
              <th>固定%</th>
              <th>効果加算</th>
              <th>固定%上限</th>
              <th>条件式</th>
              <th>発動条件式</th>
              <th>冲突</th>
              <th>冲突状态</th>
              <th>対象</th>
            </tr>
          </thead>
          <tbody className="ant-table-tbody">
            {skill.InfluenceConfig.map((config: any, index: number) => {
              const description = influences.find(
                (influence: any) => influence.ID === config.Data_InfluenceType,
              );
              return (
                <tr key={index}>
                  <td>
                    {config.Data_InfluenceType}
                    {description && ` / ${description.Description}`}
                  </td>
                  <td>{config.Data_MulValue}</td>
                  <td>{config.Data_MulValue2}</td>
                  <td>{config.Data_MulValue3}</td>
                  <td>{config.Data_AddValue}</td>
                  <td>{config._HoldRatioUpperLimit}</td>
                  <td>{config._Expression}</td>
                  <td>{config._ExpressionActivate}</td>
                  <td>{config.Type_Collision}</td>
                  <td>{config.Type_CollisionState}</td>
                  <td>{config.Data_Target}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default SkillInfluenceTable;
