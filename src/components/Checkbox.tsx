import React from 'react'
import { CheckboxProps } from '../types'
import { ErrorMessage } from './ErrorMessage'

const renderErrorText = (withError?: string, errorMessageStyles?: React.CSSProperties)  => (
    <ErrorMessage
        text={withError}
        style={errorMessageStyles}
    />
)

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
    renderComponent,
    isSelected,
    withError,
    errorMessageStyles,
    onClick
}) => renderComponent ? (
    <div onClick={onClick}>
        {renderComponent(Boolean(isSelected), onClick)}
        {renderErrorText(withError, errorMessageStyles)}
    </div>
) : null

Checkbox.defaultProps = {
    errorMessageStyles: {}
}
