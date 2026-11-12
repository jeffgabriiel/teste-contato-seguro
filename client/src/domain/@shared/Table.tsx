import { Empty, Table as AntdTable, type TableProps as AntdTableProps } from 'antd';

type Props<RecordType> = Omit<AntdTableProps<RecordType>, 'rowKey' | 'rootClassName'>;

export function Table<RecordType extends { id: number }>({ pagination, ...props }: Props<RecordType>) {
    const emptyText = (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Não há dados"
        />
    );

    return (
        <AntdTable
            {...props}
            rowKey={row => row.id}
            rootClassName="table-horizontal-scroll"
            pagination={pagination === false
                ? false
                : {
                    pageSize: 5,
                    hideOnSinglePage: true,
                    ...pagination,
                }}
            /** @see https://github.com/ant-design/ant-design/issues/7690#issuecomment-558846552 */
            locale={{ emptyText }}
        />
    );
}
