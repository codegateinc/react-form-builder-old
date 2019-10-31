import React, { Fragment } from 'react'
import { ErrorMessage } from './ErrorMessage'
import { CustomFieldProps } from '../types'

export class CustomField extends React.Component<CustomFieldProps> {
    constructor(props: CustomFieldProps) {
        super(props)

        this.onCustomFieldBlur = this.onCustomFieldBlur.bind(this)
        this.onCustomFieldChange = this.onCustomFieldChange.bind(this)
    }

    onCustomFieldChange(value: string) {
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    onCustomFieldBlur() {
        if (this.props.onBlur) {
            this.props.onBlur()
        }
    }

    renderCustomField() {
        if (this.props.value === undefined) {
            throw Error('value is required')
        }

        return this.props.component(this.props.value, this.onCustomFieldChange, this.onCustomFieldBlur)
    }

    renderError() {
        return (
            <ErrorMessage
                text={this.props.withError}
                style={this.props.customErrorStyle}
            />
        )
    }

    render() {
        return (
            <Fragment>
                {this.renderCustomField()}
                {this.renderError()}
            </Fragment>
        )
    }
}
