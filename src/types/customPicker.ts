import React from 'react'

export enum CustomPickerMode {
    Single = 0,
    Multi = 1,
}

export type CustomPickerOption = {
    value: string | number | null,
    label: string,
    isSelected: boolean,
    isSelectable?: boolean
}

export type CustomPickerValidationRule = {
    errorMessage: string
    validationFunction(selectedOptions: Array<CustomPickerOption>): boolean,
}

export type TogglePickerVisibilityState = (isVisible: boolean) => void
export type RenderPlaceholderComponent = (selectedOptions: Array<CustomPickerOption>, isPickerVisible: boolean, togglePicker: TogglePickerVisibilityState) => React.ReactNode
export type OnCustomPickerOptionPress = (options: Array<number | string | null>) => void

export type CustomPickerState = {
    isPickerVisible: boolean,
}

export type CustomPickerProps = {
    withError?: string,
    isPristine?: boolean,
    formFieldName?: string,
    customErrorStyle?: React.CSSProperties,
    onOptionChange?: OnCustomPickerOptionPress,
    isPickerAlwaysVisible?: boolean,
    options?: Array<CustomPickerOption>,
    renderPlaceholderComponent?: RenderPlaceholderComponent,
    onBlur?: () => void,
    renderPickerComponent(
        options: Array<CustomPickerOption>,
        onOptionPress: OnCustomPickerOptionPress,
        togglePicker: TogglePickerVisibilityState,
        onBlur: () => void,
        isPristine: boolean
    ): React.ReactNode,
}
