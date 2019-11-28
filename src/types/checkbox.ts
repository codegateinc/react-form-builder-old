import React from 'react'

export type RenderCheckboxComponent = (isSelected: boolean, onClick: () => void) => React.ReactNode
export type OnCheckboxChange = () => void

export type CheckboxProps = {
    isSelected?: boolean,
    withError?: string,
    formFieldName?: string,
    onClick: OnCheckboxChange,
    renderComponent?: RenderCheckboxComponent,
    errorMessageStyles?: React.CSSProperties
}
