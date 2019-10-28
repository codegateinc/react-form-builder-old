import React, { Fragment } from 'react'
import { CustomPickerOption, CustomPickerProps, CustomPickerState } from '../types'
import { ErrorMessage } from './ErrorMessage'

export class CustomPicker extends React.Component<CustomPickerProps, CustomPickerState> {
    state: CustomPickerState = {
        isPickerVisible: Boolean(this.props.isPickerAlwaysVisible)
    }

    constructor(props: CustomPickerProps) {
        super(props)

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

    onOptionPress(option: CustomPickerOption) {
        if (this.props.onOptionChange) {
            this.props.onOptionChange({
                ...option,
                isSelected: !Boolean(option.isSelected)
            })
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

    renderPickerComponent() {
        if (!this.props.options) {
            throw new Error('options are mandatory')
        }

        return this.state.isPickerVisible ? (
            <Fragment>
                {this.props.renderPickerComponent(this.props.options, this.onOptionPress, this.setPickerVisibility)}
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
