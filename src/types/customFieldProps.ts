import React, { ReactNode } from 'react'

type onChangeType = (value: string) => void

export type CustomFieldProps = {
    formFieldName?: string,
    onChange?: onChangeType,
    withError?: string,
    value?: string,
    isPristine?: boolean,
    customErrorStyle?: React.CSSProperties,
    onBlur?(): void,
    component(value: string, onChange: onChangeType, onBlur: () => void, isPristine: boolean): ReactNode
}
