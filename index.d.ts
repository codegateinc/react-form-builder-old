import React, { ReactNode } from 'react'

type InputProps = {
    formFieldName?: string,
    inputProps?: React.HTMLProps<HTMLInputElement>,
    withError?: string,
    errorMessageStyles?: React.CSSProperties
}

type LabelProps = {
    text: string,
    customTextStyles?: React.CSSProperties
}

export type FormErrors = {
    [key: string]: string | number
}

export type CustomValue = {
    [key: string]: any
}

export type FormFieldValidationRule = {
    errorMessage: string
    validationFunction(text: string): boolean,
}

export type FormCheckboxValidationRule = {
    errorMessage: string,
    validationFunction(isSelected: boolean): boolean
}

type FormFieldBase = {
    isRequired: boolean,
    fieldType: FormField
}

type InputCompareWith = {
    fieldName: string,
    errorMessage: string
}

export interface FormInputConfigProps extends FormFieldBase {
    value: string | number | boolean,
    inputProps?: React.HTMLProps<HTMLInputElement>,
    validationRules?: Array<FormFieldValidationRule>,
    compareWith?: InputCompareWith,
    liveParser?(value: string): string,
    submitParser?(value: string): string
}

export enum CustomPickerMode {
    Single = 0,
    Multi = 1,
}

export type CustomPickerValidationRule = {
    errorMessage: string
    validationFunction(selectedOptions: Array<CustomPickerOption>): boolean,
}

export interface FormCustomPickerConfigProps extends FormFieldBase {
    options: Array<CustomPickerOption>,
    pickerMode: CustomPickerMode,
    validationRules?: Array<CustomPickerValidationRule>
}


export interface FormCheckboxConfigProps extends FormFieldBase {
    value: boolean,
    validationRule?: FormCheckboxValidationRule
}

export type FieldConfig = FormInputConfigProps | FormCustomPickerConfigProps | FormCheckboxConfigProps

export type FormConfig = {
    [key: string]: FieldConfig
}

interface FormInputState extends FormFieldBase {
    isValid: boolean,
    hasError?: string,
    value: string,
}

interface FormCustomPickerState extends FormFieldBase {
    options: Array<CustomPickerOption>,
    hasError?: string
}

export interface FormCheckboxState extends FormFieldBase {
    hasError?: string,
    value: boolean,
    isPristine: boolean
}

type FieldState = FormInputState | FormCustomPickerState | FormCheckboxState

type FormBuilderState = {
    [key: string]: FieldState
}

type FormBuilderProps<T> = {
    isScrollable?: boolean,
    isLoading?: boolean,
    customFormContainerStyles?: React.CSSProperties,
    formConfig: FormConfig,
    debounceTime?: number,
    onFormUpdate?(form: T): void,
    onFormSubmit(form: T): void,
    onFormError?(errors: FormErrors): void
}

export enum FormField {
    Input = 0,
    CustomPicker = 1,
    Checkbox = 2,
    CustomField = 3
}

export type CustomPickerOption = {
    value: string | number | null,
    label: string,
    isSelected?: boolean,
    isSelectable?: boolean
}

export type TogglePickerVisibilityState = (isVisible: boolean) => void
export type RenderPlaceholderComponent = (selectedOptions: Array<CustomPickerOption>, isPickerVisible: boolean, togglePicker: TogglePickerVisibilityState) => ReactNode

type CustomPickerState = {
    isPickerVisible: boolean,
}

export type OnCustomPickerOptionPress = (options: Array<number | string | null>) => void

type CustomPickerProps = {
    withError?: string,
    customErrorStyle?: React.CSSProperties,
    formFieldName?: string,
    onOptionChange?: OnCustomPickerOptionPress,
    isPickerAlwaysVisible?: boolean,
    options?: Array<CustomPickerOption>,
    renderPlaceholderComponent?: RenderPlaceholderComponent,
    renderPickerComponent(
        options: Array<CustomPickerOption>,
        onOptionPress: OnCustomPickerOptionPress,
        togglePicker: TogglePickerVisibilityState,
        onBlur: () => void,
        isPristine: boolean
    ): ReactNode,
}

type onChangeType = (value: string) => void

export type CustomFieldProps = {
    formFieldName?: string,
    onChange?: onChangeType,
    withError?: string,
    value?: string,
    customErrorStyle?: React.CSSProperties,
    onBlur?(): void,
    component(value: string, onChange: onChangeType, onBlur: () => void, isPristine: boolean): ReactNode
}


// checkbox

export type RenderCheckboxComponent = (isSelected: boolean, onClick: () => void) => React.ReactNode
export type OnCheckboxChange = () => void

export type CheckboxProps = {
    isSelected?: boolean,
    withError?: string,
    formFieldName?: string,
    onClick?: OnCheckboxChange,
    renderComponent?: RenderCheckboxComponent,
    errorMessageStyles?: React.CSSProperties
}

// tslint:disable max-classes-per-file
export const Input: React.FunctionComponent<InputProps> = () => {}
export const Label: React.FunctionComponent<LabelProps> = () => {}
export const Checkbox: React.FunctionComponent<CheckboxProps> = () => {}
export class CustomPicker extends React.Component<CustomPickerProps, CustomPickerState> {}
export class CustomField extends React.Component<CustomFieldProps> {}
export class Form<T = {}> extends React.Component<FormBuilderProps<T>, FormBuilderState> {
    submitForm(): T
    setCustomFieldError(fieldName: string, errorMessage: string): void
    hasChanges(): boolean
    restoreInitialValues(): void
    clearValues(): void
    formValues: T
    setCustomFieldValue: (fieldName: string, value: string | number | boolean) => void
}
