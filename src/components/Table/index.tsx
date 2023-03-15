import { ReactNode, useEffect, useState } from 'react';
import { default as BSTable, TableProps } from 'react-bootstrap/Table';
import { v4 } from 'uuid';
import cs from 'classnames';
import _camelCase from 'lodash/camelCase';
import s from './styles.module.scss';
import { Empty } from '@components/Collection/Empty';

export type TColumn = {
  id: string;
  config?: Record<string, string | number | undefined>;
  render: {
    [x: string]: ReactNode;
  };
};

interface IProps extends TableProps {
  data?: TColumn[];
  tableHead: ReactNode[];
  className?: string;
}

const Table = ({
  tableHead = [],
  data,
  className,
  ...delegatedProps
}: IProps) => {
  const [tableData, setTableData] = useState<TColumn[] | null>(null);

  const TableHeads = () => {
    return (
      <thead className={s.tableHead}>
        <tr>
          {tableHead?.length > 0 &&
            tableHead.map((label, index) => (
              <th
                key={`thead-${index}`}
                className={cs(s.tableHead_item, _camelCase(label?.toString()))}
              >
                {label}
              </th>
            ))}
        </tr>
      </thead>
    );
  };

  const TableData = ({ rowData }: { rowData: TColumn }) => {
    return (
      <tr {...rowData.config} className={s.tableData}>
        {rowData.render &&
          Object.values(rowData.render).map((value, index) => (
            <td key={`tdata-${index}}`} className={s.tableData_item}>
              {value}
            </td>
          ))}
      </tr>
    );
  };

  const TableBody = () => {
    return (
      <tbody>
        {tableData &&
          tableData?.length > 0 &&
          tableData.map(row => (
            <TableData rowData={row} key={`trowData-${v4()}`} />
          ))}
      </tbody>
    );
  };

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  return (
    <div className={s.wrapper}>
      <BSTable bordered className={cs(s.table, className)} {...delegatedProps}>
        <TableHeads />
        <TableBody />
        {(!tableData || tableData.length === 0) && (
          <tbody className={s.empty}>
            <tr>
              <Empty content="No Data Available." />
            </tr>
          </tbody>
        )}
      </BSTable>
    </div>
  );
};

export default Table;
