import { ReactNode, useEffect, useState } from 'react';
import { default as BSTable } from 'react-bootstrap/Table';
import { v4 } from 'uuid';
import cs from 'classnames';
import s from './styles.module.scss';
import { Empty } from '@components/Collection/Empty';

export type TColumn = {
  id: string;
  config?: Record<string, string | number | undefined>;
  render: {
    [x: string]: ReactNode;
  };
};

type Props = {
  data?: TColumn[];
  tableHead: ReactNode[];
  className?: string;
};

const Table = ({ tableHead = [], data, className }: Props) => {
  const [tableData, setTableData] = useState<TColumn[] | null>(null);

  const TableHeads = () => {
    return (
      <thead className={s.tableHead}>
        <tr>
          {tableHead?.length > 0 &&
            tableHead.map(label => (
              <th key={`thead-${v4()}`} className={s.tableHead_item}>
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
          Object.values(rowData.render).map(value => (
            <td key={`tdata-${v4()}`} className={s.tableData_item}>
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
      <BSTable bordered className={cs(s.table, className)}>
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
