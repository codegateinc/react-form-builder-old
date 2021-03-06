import React, { Fragment } from 'react'
import { CustomPickerProps, CustomPickerState } from '../types'
import { ErrorMessage } from './ErrorMessage'

export class CustomPicker extends React.Component<CustomPickerProps, CustomPickerState> {
    state: CustomPickerState = {
        isPickerVisible: Boolean(this.props.isPickerAlwaysVisible)
    }

    constructor(props: CustomPickerProps) {
        super(props)

        this.onBlur = this.onBlur.bind(this)
        this.onOptionPress = this.onOptionPress.bind(this)
        this.setPickerVisibility = this.setPickerVisibility.bind(this)
    }

    setPickerVisibility(isVisible: boolean) {
        if (Boolean(this.props.isPickerAlwaysVisible)) {
            return
        }

        this.setState({
            isPickerVisible: isVisible
        })
    }

    onOptionPress(options: Array<number | string | null>) {
        if (this.props.onOptionChange) {
            this.props.onOptionChange(options)
        }
    }

    renderPlaceholderComponent() {
        if (!this.props.renderPlaceholderComponent || !this.props.options) {
            return null
        }

        const selectedOptions = this.props.options.filter(option => Boolean(option.isSelected))

        return (
            <Fragment>
                {this.props.renderPlaceholderComponent(selectedOptions, this.state.isPickerVisible, this.setPickerVisibility)}
            </Fragment>
        )
    }

    onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur()
        }
    }

    renderPickerComponent() {
        if (!this.props.options || this.props.isPristine === undefined) {
            throw new Error('options are mandatory')
        }

        return this.state.isPickerVisible ? (
            <Fragment>
                {this.props.renderPickerComponent(
                    this.props.options,
                    this.onOptionPress,
                    this.setPickerVisibility,
                    this.onBlur,
                    this.props.isPristine
                )}
            </Fragment>
        ): null
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
                {this.renderPlaceholderComponent()}
                {this.renderPickerComponent()}
                {this.renderError()}
            </Fragment>
        )
    }
}
