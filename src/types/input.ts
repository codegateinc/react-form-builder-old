import React from 'react'

export type InputProps = {
    formFieldName?: string,
    inputProps?: React.HTMLProps<HTMLInputElement>,
    withError?: string,
    errorMessageStyles?: React.CSSProperties
}
