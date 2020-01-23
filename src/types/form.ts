import React from 'react'
import { CustomPickerOption, CustomPickerMode, CustomPickerValidationRule } from './customPicker'

type FormFieldBase = {
    isRequired: boolean,
    fieldType: FormField
}

export type FormErrors = {
    [key: string]: string | number
}

export type FormFieldValidationRule = {
    errorMessage: string
    validationFunction(text: string): boolean,
}

export type FormCheckboxValidationRule = {
    errorMessage: string,
    validationFunction(isSelected: boolean): boolean
}

export enum FormField {
    Input = 0,
    CustomPicker = 1,
    Checkbox = 2,
    CustomField = 3
}

export type InputCompareWith = {
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

export interface FormCheckboxConfigProps extends FormFieldBase {
    value: boolean,
    validationRule?: FormCheckboxValidationRule
}

export interface FormCustomPickerConfigProps extends FormFieldBase {
    options: Array<CustomPickerOption>,
    pickerMode: CustomPickerMode,
    validationRules?: Array<CustomPickerValidationRule>
}

export type FieldConfig = FormInputConfigProps | FormCustomPickerConfigProps | FormCheckboxConfigProps

export type FormConfig = {
    [key: string]: FieldConfig
}

export interface FormInputState extends FormFieldBase {
    isValid: boolean,
    hasError?: string,
    value: string,
    isPristine: boolean
}

export interface FormCheckboxState extends FormFieldBase {
    hasError?: string,
    value: boolean,
    isPristine: boolean
}

export interface FormCustomPickerState extends FormFieldBase {
    options: Array<CustomPickerOption>,
    hasError?: string,
    isPristine: boolean,
}

export type FieldState = FormInputState | FormCustomPickerState | FormCheckboxState

export type FormBuilderState = {
    [key: string]: FieldState
}

export type FormBuilderProps<T> = {
    isLoading?: boolean,
    customFormContainerStyles?: React.CSSProperties,
    formConfig: FormConfig,
    debounceTime?: number,
    onFormUpdate?(form: T): void,
    onFormSubmit(form: T): void,
    onFormError?(errors: FormErrors): void
}
