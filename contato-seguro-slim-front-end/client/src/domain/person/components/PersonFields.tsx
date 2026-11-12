import { Fragment } from 'react';

import { DatePicker, Form, Input } from 'antd';

import dayjs, { type Dayjs } from 'dayjs';

export type Values = {
    name: string;
    cpf: string;
    email: string;
    birth_date: Dayjs;
};

function onlyCpfDigits(value: string) {
    return value.replace(/\D/g, '');
}

function formatCpf(value: string) {
    const digits = onlyCpfDigits(value).slice(0, 11);

    if (digits.length <= 3)
        return digits;

    if (digits.length <= 6)
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;

    if (digits.length <= 9)
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCpf(value: string) {
    const digits = onlyCpfDigits(value);

    if (!/^\d{11}$/.test(digits))
        return false;

    if (/^(\d)\1{10}$/.test(digits))
        return false;

    const first = cpfCheckDigit(digits, 9);
    const second = cpfCheckDigit(digits, 10);

    return first === Number(digits[9]) && second === Number(digits[10]);
}

function cpfCheckDigit(digits: string, length: number) {
    let sum = 0;

    for (let index = 0; index < length; index++)
        sum += Number(digits[index]) * (length + 1 - index);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
}

function getBirthDateBounds() {
    return {
        min: dayjs().subtract(120, 'year').startOf('day'),
        max: dayjs().subtract(18, 'year').endOf('day'),
    };
}

function isBirthDateDisabled(current: Dayjs) {
    const { min, max } = getBirthDateBounds();

    return current.isBefore(min, 'day') || current.isAfter(max, 'day');
}

function validateName(_: unknown, value: string | undefined) {
    const name = (value ?? '').trim();

    if (!name)
        return Promise.reject(new Error('Por favor, digite o nome completo.'));

    if (name.length < 2 || name.length > 120)
        return Promise.reject(new Error('O nome deve ter entre 2 e 120 caracteres.'));

    return Promise.resolve();
}

function validateCpf(_: unknown, value: string | undefined) {
    const digits = onlyCpfDigits(value ?? '');

    if (!digits)
        return Promise.resolve();

    if (digits.length !== 11)
        return Promise.reject(new Error('O CPF deve ter 11 dígitos.'));

    if (!isValidCpf(digits))
        return Promise.reject(new Error('Por favor, digite um CPF válido.'));

    return Promise.resolve();
}

function validateBirthDate(_: unknown, value: Dayjs | null) {
    if (!value)
        return Promise.resolve();

    if (!value.isValid())
        return Promise.reject(new Error('Por favor, informe uma data válida.'));

    const { min, max } = getBirthDateBounds();

    if (value.isAfter(max, 'day'))
        return Promise.reject(new Error('A pessoa deve ter no mínimo 18 anos.'));

    if (value.isBefore(min, 'day'))
        return Promise.reject(new Error('A data de nascimento não pode ser anterior a 120 anos.'));

    return Promise.resolve();
}

function CpfInput({ value = '', onChange }: { value?: string; onChange?: (value: string) => void }) {
    return (
        <Input
            placeholder="000.000.000-00"
            maxLength={14}
            inputMode="numeric"
            value={formatCpf(value)}
            onChange={event => onChange?.(formatCpf(event.target.value))}
        />
    );
}

export function PersonFields() {
    const form = Form.useFormInstance();

    return (
        <Fragment>
            <Form.Item<Values>
                name="name"
                label="Nome completo"
                rules={[{ validator: validateName }]}
            >
                <Input
                    placeholder="Nome completo"
                    maxLength={120}
                    onBlur={(event) => {
                        form.setFieldValue('name', event.target.value.trim());
                    }}
                />
            </Form.Item>

            <Form.Item<Values>
                name="cpf"
                label="CPF"
                rules={[
                    { required: true, message: 'Por favor, digite um CPF.' },
                    { validator: validateCpf },
                ]}
            >
                <CpfInput />
            </Form.Item>

            <Form.Item<Values>
                name="email"
                label="E-mail"
                normalize={(value?: string) => value?.trim().toLowerCase()}
                rules={[
                    { required: true, message: 'Por favor, digite um e-mail.' },
                    { type: 'email', message: 'Por favor, digite um e-mail válido.' },
                ]}
            >
                <Input placeholder="E-mail de contato" />
            </Form.Item>

            <Form.Item<Values>
                name="birth_date"
                label="Data de nascimento"
                rules={[
                    { required: true, message: 'Por favor, informe a data de nascimento.' },
                    { validator: validateBirthDate },
                ]}
            >
                <DatePicker
                    format={{ format: 'DD/MM/YYYY', type: 'mask' }}
                    placeholder="DD/MM/AAAA"
                    style={{ width: '100%' }}
                    inputMode="numeric"
                    disabledDate={isBirthDateDisabled}
                />
            </Form.Item>
        </Fragment>
    );
}
