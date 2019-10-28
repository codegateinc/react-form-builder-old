import React from 'react'
import { colors } from 'lib/styles'
import { ErrorMessageProps } from '../types'

export const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = ({ text, style }) => text ? (
    <div
        style={{
            ...styles.errorMessage,
            ...style
        }}
    >
        {text}
    </div>
) : null

ErrorMessage.defaultProps = {
    style: {}
}

const styles = {
    errorMessage: {
        paddingHorizontal: 2,
        color: colors.red,
        fontSize: 11,
        paddingTop: 5,
    }
}
