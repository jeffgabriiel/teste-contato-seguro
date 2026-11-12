import { Fragment } from 'react';

import { Form, Select } from 'antd';

import type { Person } from '@domain/person/person.type';

import type { Involvement } from '../involvement.type';
import { INVOLVEMENT_TYPE_LABELS } from '../involvement.type';

const TYPE_OPTIONS = (Object.entries(INVOLVEMENT_TYPE_LABELS) as [Involvement.Type, string][])
    .map(([value, label]) => ({ value, label }));

export type Values = {
    person_id: Person.Model['id'];
    type: Involvement.Type;
};

type Props = {
    people: Person.Model[];
    isLoadingPeople: boolean;
};

function formatCpf(cpf: string) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function AddInvolvementFields({ people, isLoadingPeople }: Props) {
    return (
        <Fragment>
            <Form.Item<Values>
                name="person_id"
                label="Pessoa"
                rules={[{ required: true, message: 'Por favor, selecione uma pessoa.' }]}
            >
                <Select
                    options={people.map(person => ({
                        label: `${person.name} (${formatCpf(person.cpf)})`,
                        value: person.id,
                    }))}
                    placeholder="Selecione uma pessoa"
                    loading={isLoadingPeople}
                    showSearch
                    filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item<Values>
                name="type"
                label="Tipo de envolvimento"
                rules={[{ required: true, message: 'Por favor, selecione o tipo de envolvimento.' }]}
            >
                <Select options={TYPE_OPTIONS} placeholder="Selecione o tipo" />
            </Form.Item>
        </Fragment>
    );
}
