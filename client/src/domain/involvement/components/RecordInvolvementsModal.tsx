import { useCallback, useEffect, useState } from 'react';

import { App, Button, Divider, Form, Modal, Popconfirm, Space, type TableColumnsType, Tag, Typography } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { Show } from '@domain/@shared/Show';
import { sleep } from '@domain/@shared/sleep';
import { Table } from '@domain/@shared/Table';
import { listPeople } from '@domain/person/api/list-people.service';
import type { Person } from '@domain/person/person.type';
import type { Record } from '@domain/record/record.type';

import { createInvolvement } from '../api/create-involvement.service';
import { deleteInvolvement } from '../api/delete-involvement.service';
import { listInvolvements } from '../api/list-involvements.service';
import type { Involvement } from '../involvement.type';
import { INVOLVEMENT_TYPE_LABELS } from '../involvement.type';
import { AddInvolvementFields, type Values } from './AddInvolvementFields';

type Props = {
    record: Record.Model;
    onClose: () => void;
    onCountChange?: (count: number) => void;
};

type RemoveProps = {
    recordId: Record.Model['id'];
    involvementId: Involvement.Model['id'];
    onRemoved: () => void;
};

function RemoveInvolvementButton({ recordId, involvementId, onRemoved }: RemoveProps) {
    const [isPopconfirmVisible, setIsPopconfirmVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const app = App.useApp();

    const handleDelete = async () => {
        setIsSending(true);

        const response = await deleteInvolvement(recordId, involvementId);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setIsPopconfirmVisible(false);
        onRemoved();
    };

    return (
        <Popconfirm
            title="Remover envolvido"
            description="Tem certeza que deseja remover este vínculo?"
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
                title="Remover"
                onClick={() => setIsPopconfirmVisible(true)}
            />
        </Popconfirm>
    );
}

export function RecordInvolvementsModal({ record, onClose, onCountChange }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPeople, setIsLoadingPeople] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [involvements, setInvolvements] = useState<Involvement.Model[]>([]);
    const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
    const [people, setPeople] = useState<Person.Model[]>([]);

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const fetchInvolvements = useCallback(async () => {
        setIsLoading(true);

        const response = await listInvolvements(record.id);

        setIsLoading(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setInvolvements(response.data.involvements);
        setIsAnonymous(response.data.is_anonymous);
        onCountChange?.(response.data.involvements.length);
    }, [app, onCountChange, record.id]);

    const fetchPeople = useCallback(async () => {
        setIsLoadingPeople(true);

        const response = await listPeople();

        setIsLoadingPeople(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        setPeople(response.data.people);
    }, [app]);

    useEffect(() => {
        fetchInvolvements();
        fetchPeople();
    }, [fetchInvolvements, fetchPeople]);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createInvolvement(record.id, values);

        await sleep(1000);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, error =>
                error.statusCode === 409 ? 'Esta pessoa já está vinculada a este relato.' : null
            );

        form.resetFields();
        fetchInvolvements();
    };

    const columns: TableColumnsType<Involvement.Model> = [
        {
            title: 'Pessoa',
            dataIndex: ['person', 'name'],
        },
        {
            title: 'CPF',
            dataIndex: ['person', 'cpf'],
            render: value => String(value).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4'),
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            render: (value: Involvement.Type) => INVOLVEMENT_TYPE_LABELS[value] ?? value,
        },
        {
            render: (_, involvement) => (
                <RemoveInvolvementButton
                    recordId={record.id}
                    involvementId={involvement.id}
                    onRemoved={fetchInvolvements}
                />
            ),
        },
    ];

    return (
        <Modal
            open
            width={720}
            title="Envolvidos"
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Adicionar"
            okButtonProps={{ disabled: people.length === 0 }}
            onCancel={onClose}
            cancelText="Fechar"
            styles={{ body: { overflow: 'hidden' } }}
        >
            <Divider />

            <Space align="center" style={{ marginBottom: 16 }}>
                <Typography.Text strong>
                    {record.title}
                </Typography.Text>

                <Show when={isAnonymous !== null}>
                    <Tag color={isAnonymous ? 'default' : 'blue'}>
                        {isAnonymous ? 'Anônimo' : 'Identificado'}
                    </Tag>
                </Show>
            </Space>

            <Table
                columns={columns}
                dataSource={involvements}
                loading={isLoading}
                pagination={{ pageSize: 15 }}
                scroll={{ y: 240 }}
            />

            <Divider />

            <Show when={!isLoadingPeople && people.length === 0}>
                <Typography.Paragraph type="secondary">
                    Nenhuma pessoa cadastrada. Cadastre uma pessoa para vincular ao relato.
                </Typography.Paragraph>
            </Show>

            <Form
                form={form}
                onFinish={onFinish}
                name="addInvolvement"
                layout="vertical"
                autoComplete="off"
            >
                <AddInvolvementFields people={people} isLoadingPeople={isLoadingPeople} />
            </Form>
        </Modal>
    );
}
