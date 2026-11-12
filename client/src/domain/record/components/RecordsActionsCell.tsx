import { useEffect, useState } from 'react';

import { App, Badge, Button, Popconfirm, Space } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { Show } from '@domain/@shared/Show';
import { sleep } from '@domain/@shared/sleep';
import { listInvolvements } from '@domain/involvement/api/list-involvements.service';
import { RecordInvolvementsModal } from '@domain/involvement/components/RecordInvolvementsModal';

import { deleteRecord } from '../api/delete-record.service';
import type { Record } from '../record.type';
import { useRecordsContext } from '../Records.context';

type Props = { record: Record.Model };

export function RecordsActionsCell({ record }: Props) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isInvolvementsModalVisible, setIsInvolvementsModalVisible] = useState(false);
    const [involvementsCount, setInvolvementsCount] = useState(0);

    const { setRecordId, setIsEditModalVisible, fetchRecords } = useRecordsContext();

    const app = App.useApp();

    useEffect(() => {
        let cancelled = false;

        const fetchInvolvementsCount = async () => {
            const response = await listInvolvements(record.id);

            if (cancelled || hasServiceError(response))
                return;

            setInvolvementsCount(response.data.involvements.length);
        };

        fetchInvolvementsCount();

        return () => {
            cancelled = true;
        };
    }, [record.id]);

    const handleEdit = () => {
        setRecordId(record.id);
        setIsEditModalVisible(true);
    };

    const handleDelete = async () => {
        setIsSending(true);

        const response = await deleteRecord(record.id);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setIsPopconfirmVisible(false);
        fetchRecords();
    };

    return (
        <Space size="middle">
            <Button
                type="text"
                onClick={() => setIsInvolvementsModalVisible(true)}
            >
                <span style={{ position: 'relative', display: 'inline-block' }}>
                    <Badge
                        count={involvementsCount}
                        showZero
                        size="small"
                        styles={{
                            root: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                transform: 'translate(-50%, -90%)',
                                zIndex: 1,
                            },
                            indicator: {
                                minWidth: 14,
                                height: 14,
                                lineHeight: '14px',
                                fontSize: 10,
                                padding: 0,
                            },
                        }}
                    />
                    Envolvidos
                </span>
            </Button>

            <Button
                type="text"
                icon={<EditOutlined />}
                title="Editar"
                onClick={handleEdit}
            />

            <Popconfirm
                title="Excluir relato"
                description="Tem certeza que deseja excluir o relato?"
                open={isPopconfirmVisible}
                placement="left"
                cancelText="Não"
                okText="Sim"
                okType="danger"
                okButtonProps={{ loading: isSending }}
                onConfirm={handleDelete}
                onCancel={() => setIsPopconfirmVisible(false)}
            >
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Excluir"
                    onClick={() => setIsPopconfirmVisible(true)}
                />
            </Popconfirm>

            <Show when={isInvolvementsModalVisible}>
                <RecordInvolvementsModal
                    record={record}
                    onClose={() => setIsInvolvementsModalVisible(false)}
                    onCountChange={setInvolvementsCount}
                />
            </Show>
        </Space>
    );
}
