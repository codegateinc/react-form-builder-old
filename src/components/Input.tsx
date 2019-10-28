import React from 'react'
import { colors } from 'lib/styles'
import { InputProps } from '../types'
import { ErrorMessage } from './ErrorMessage'

const renderErrorText = (withError?: string, errorMessageStyles?: React.CSSProperties)  => (
    <ErrorMessage
        text={withError}
        style={errorMessageStyles}
    />
)

export const Input: React.FunctionComponent<InputProps> = props => {
    const { inputProps, withError, errorMessageStyles } = props
    const { style, ...rest } = inputProps || {}

    return (
        <div style={styles.container}>
            <div style={styles.inputWrapper}>
                <input
                    style={{
                        ...styles.input,
                        ...withError ? styles.errorInput : {},
                        ...style
                    }}
                    {...rest}
                />
            </div>
            {renderErrorText(withError, errorMessageStyles)}
        </div>
    )
}

Input.defaultProps = {
    errorMessageStyles: {},
    inputProps: {
        style: {}
    }
}

const styles = {
    container: {
        width: '100%'
    },
    inputWrapper: {
        width: '100%'
    },
    input: {
        width: '100%',
        height: 36,
        borderRadius: 4,
        backgroundColor: colors.white,
        padding: '7px 15px',
        fontSize: 17,
        color: colors.midnightBlue,
        outline: 'none'
    },
    errorInput: {
        color: colors.red
    }
}
