import React, { ReactNode } from 'react'
import { R } from 'lib/utils'
import { getFormErrors, prepareFormInitialState } from '../utils'
import {
    CheckboxProps,
    CustomFieldProps,
    CustomPickerMode,
    CustomPickerOption,
    CustomPickerProps,
    FieldState,
    FormBuilderProps,
    FormBuilderState,
    FormCheckboxConfigProps,
    FormCheckboxState,
    FormCustomPickerConfigProps,
    FormCustomPickerState,
    FormField,
    FormInputConfigProps,
    FormInputState,
    InputCompareWith,
    InputProps
} from '../types'
import { Input } from './Input'
import { CustomPicker } from './CustomPicker'
import { Checkbox } from './Checkbox'
import { CustomField } from './CustomField'

type FormProps<T> = FormBuilderProps<T>

type FormState = {
    form: FormBuilderState
}

export class Form<T> extends React.Component<FormProps<T>, FormState> {
    static defaultProps: Partial<FormProps<{}>> = {
        customFormContainerStyles: {}
    }

    constructor(props: FormProps<T>) {
        super(props)

        this.state = {
            form: prepareFormInitialState(this.props.formConfig)
        }

        this.submitForm = this.submitForm.bind(this)
        this.updateState = this.updateState.bind(this)
        this.renderChild = this.renderChild.bind(this)
        this.handleFormError = this.handleFormError.bind(this)
        this.checkedFormFields = this.checkedFormFields.bind(this)
    }

    get isFormValid() {
        const areInputsValid = R.toPairs(this.state.form)
            .filter(([, fieldObject ]) => fieldObject.fieldType === FormField.Input)
            .map(([fieldName, fieldObject]) => this.validateField(fieldName, (fieldObject as FormInputState).value))
            .every(Boolean)

        const areCustomPickersValid = R.toPairs(this.state.form)
            .filter(([, fieldObject]) => fieldObject.fieldType === FormField.CustomPicker)
            .map(([fieldName]) => this.validateCustomPicker(fieldName))
            .every(Boolean)

        const areCheckboxesValid = R.toPairs(this.state.form)
            .filter(([, fieldObject ]) => fieldObject.fieldType === FormField.Checkbox && fieldObject.isRequired)
            .map(([fieldName]) => this.validateCheckbox(fieldName))
            .every(Boolean)

        return R.all(
            areInputsValid,
            areCustomPickersValid,
            areCheckboxesValid,
            !this.props.isLoading
        )
    }

    get hasValidCompares() {
        const inputsToCompare = R.toPairs(this.state.form)
            .filter(([ fieldName, fieldObject ]) =>
                fieldObject.fieldType === FormField.Input && Boolean((this.props.formConfig[fieldName] as FormInputConfigProps).compareWith)
            ) as Array<[string, FormInputState]>

        return inputsToCompare.length
            ? inputsToCompare
                .map(([ fieldName, fieldObject ]) => {
                    const fieldToCompare = ((this.props.formConfig[fieldName] as FormInputConfigProps).compareWith as InputCompareWith).fieldName

                    return fieldObject.value === (this.state.form[fieldToCompare] as FormInputState).value
                })
                .every(Boolean)
            : true
    }

    get formValues() {
        return R.toPairs(this.state.form)
            .reduce((acc, [ fieldName, fieldObject ]) => {
                if (fieldObject.fieldType === FormField.Input) {
                    const inputStateProperties = fieldObject as FormInputState
                    const submitParser = (this.props.formConfig[fieldName] as FormInputConfigProps).submitParser

                    return {
                        ...acc,
                        [fieldName] : submitParser
                            ? submitParser((fieldObject as FormInputState).value)
                            : inputStateProperties.value
                    }
                }

                if (fieldObject.fieldType === FormField.Checkbox) {
                    return {
                        ...acc,
                        [fieldName]: (fieldObject as FormCheckboxState).value
                    }
                }

                if (fieldObject.fieldType === FormField.CustomField) {
                    return {
                        ...acc,
                        [fieldName]: (fieldObject as FormCheckboxState).value
                    }
                }

                // CustomPicker
                return {
                    ...acc,
                    [fieldName] : (fieldObject as FormCustomPickerState).options
                        .filter(option => option.isSelected)
                        .map(option => option.value)
                }
            }, {}) as T
    }

    updateState(form: FormBuilderState, callBack?: () => void) {
        this.setState({
            form
        }, () => {
            if (callBack) {
                callBack()
            }

            if (this.props.onFormUpdate) {
                this.props.onFormUpdate(this.formValues)
            }
        })
    }

    hasChanges() {
        return R.toPairs(this.state.form)
            .some(([, fieldObject]) => !fieldObject.isPristine)
    }

    handleFormError() {
        if (this.props.onFormError) {
            const errors = getFormErrors(this.state.form)

            this.props.onFormError(errors)
        }
    }

    setCustomFieldError(fieldName: string, errorMessage: string) {
        this.updateState({
            ...this.state.form,
            [fieldName]: {
                ...this.state.form[fieldName],
                hasError: errorMessage,
                isValid: false,
            } as FieldState
        })
    }

    checkFieldValidation(fieldName: string, fieldObject: FieldState, value?: string) {
        if (fieldObject.fieldType === FormField.Input) {
            const fieldProperties = fieldObject as FormInputState
            const isValid = this.validateField(fieldName, fieldProperties.value as string)
            const { compareWith } = this.props.formConfig[fieldName] as FormInputConfigProps

            const hasError = R.cond([
                [
                    () => !isValid,
                    () => this.getFieldErrorMessage(fieldName, fieldProperties.value as string)
                ],
                [
                    () => Boolean(compareWith),
                    () => fieldProperties.value !== (value || (this.state.form[compareWith!.fieldName] as FormInputConfigProps).value)
                        ? compareWith!.errorMessage
                        : undefined
                ],
                [
                    R.T,
                    R.always(undefined)
                ]
            ])()

            return [fieldName, {
                ...fieldObject,
                isValid,
                hasError
            }]
        }

        if (fieldObject.fieldType === FormField.Checkbox) {
            return [fieldName, {
                ...fieldObject,
                hasError: this.getCheckboxErrorMessage(fieldName, (fieldObject as FormCheckboxState).value)
            }]
        }

        // CustomPicker

        return [fieldName, {
            ...fieldObject,
            hasError: this.getCustomPickerErrorMessage(fieldName),
        }]
    }

    checkedFormFields() {
        return R
            .toPairs(this.state.form)
            .filter(([fieldName, fieldObject]) =>
                fieldObject.isRequired ||
                (fieldObject.fieldType === FormField.Input && Boolean((fieldObject as FormInputState).value) && Boolean((this.props.formConfig[fieldName] as FormInputConfigProps).validationRules))
            )
            .map(([fieldName, fieldObject]) => this.checkFieldValidation(fieldName, fieldObject))
            .reduce((acc, [fieldName, fieldObject]) => ({
                ...acc,
                [fieldName as string]: fieldObject
            }), {})
    }

    fieldHasValidCompares(fieldName: string, compareWith: string, value?: string) {
        const formField = this.state.form[compareWith] as FormInputState
        const [, fieldObject] = this.checkFieldValidation(fieldName, formField, value)
        const validatedFieldObject = fieldObject as FieldState

        return !Boolean(validatedFieldObject.hasError)
    }

    showErrorsOnSubmit() {
        const checkedFormFields = this.checkedFormFields()

        this.updateState({
            ...this.state.form,
            ...checkedFormFields
        }, this.handleFormError)
    }

    getCustomPickerErrorMessage(fieldName: string) {
        const pickerConfig = this.props.formConfig[fieldName] as FormCustomPickerConfigProps

        if (!pickerConfig.validationRules) {
            return
        }

        const pickerState = this.state.form[fieldName] as FormCustomPickerState
        const selectedOptions = pickerState.options.filter(option => option.isSelected)

        const [errorMessage] = pickerConfig.validationRules
            .map(({ validationFunction, errorMessage }) => {
                const isValid = validationFunction(selectedOptions)

                return !isValid ? errorMessage : undefined
            })
            .filter(Boolean)

        return errorMessage
    }

    getCheckboxErrorMessage(fieldName: string, value: boolean) {
        const checkboxConfig = (this.props.formConfig[fieldName] as FormCheckboxConfigProps)

        if (!checkboxConfig.validationRule) {
            return undefined
        }

        return !checkboxConfig.validationRule.validationFunction(value)
            ? checkboxConfig.validationRule.errorMessage
            : undefined
    }

    validateCustomPicker(fieldName: string) {
        const pickerConfig = this.props.formConfig[fieldName] as FormCustomPickerConfigProps

        if (!pickerConfig.validationRules) {
            return true
        }

        const pickerState = this.state.form[fieldName] as FormCustomPickerState
        const selectedOptions = pickerState.options.filter(option => option.isSelected)

        return pickerConfig.validationRules
            .map(({ validationFunction }) => validationFunction(selectedOptions))
            .every(Boolean)
    }

    validateCheckbox(fieldName: string) {
        const checkboxConfig = (this.props.formConfig[fieldName] as FormCheckboxConfigProps)

        if (!checkboxConfig.validationRule) {
            return true
        }

        const checkboxValue = (this.state.form[fieldName] as FormCheckboxState).value

        return checkboxConfig.validationRule.validationFunction(checkboxValue)
    }

    submitForm() {
        if (!this.isFormValid || !this.hasValidCompares) {
            return this.showErrorsOnSubmit()
        }

        this.props.onFormSubmit(this.formValues)
    }

    validateField(formFieldName: string, value: string) {
        const fieldConfig = (this.props.formConfig[formFieldName] as FormInputConfigProps)

        if (!fieldConfig.isRequired && !value) {
            return true
        }

        if (fieldConfig.validationRules) {
            return fieldConfig.validationRules
                .map(({ validationFunction }) => validationFunction(value))
                .every(Boolean)
        }

        return true
    }

    getFieldErrorMessage(formFieldName: string, value: string) {
        const fieldConfig = (this.props.formConfig[formFieldName] as FormInputConfigProps)

        if (!fieldConfig.isRequired && !value) {
            return
        }

        if (fieldConfig.validationRules) {
            const [errorMessage] = fieldConfig.validationRules
                .map(({ validationFunction, errorMessage }) => {
                    const isValid = validationFunction(value)

                    return !isValid ? errorMessage : undefined
                })
                .filter(Boolean)

            return errorMessage
        }

        return
    }

    validateComparedFields(valueToCompare: string, compareFieldName: string) {
        const fieldToCompare = this.state.form[compareFieldName] as FormInputState
        const compareFieldsConfigProps = this.props.formConfig[compareFieldName] as FormInputConfigProps
        const shouldLiveCheckCompareWith = Boolean(fieldToCompare.hasError) || !fieldToCompare.isPristine
        const isValid = this.validateField(compareFieldName, fieldToCompare.value)

        if (!isValid) {
            return {
                [compareFieldName]: fieldToCompare
            }
        }

        if (valueToCompare === fieldToCompare.value && shouldLiveCheckCompareWith) {
            return {
                [compareFieldName]: {
                    ...fieldToCompare,
                    hasError: undefined
                }
            }
        }

        const newComparedFiledState = !shouldLiveCheckCompareWith
            ? {
                ...fieldToCompare,
                hasError: undefined
            } : {
                ...fieldToCompare,
                hasError: compareFieldsConfigProps.compareWith && compareFieldsConfigProps.compareWith.errorMessage
            }

        return {
            [compareFieldName]: newComparedFiledState
        }
    }

    onTextChange(value: string, formFieldName: string) {
        const formField = this.state.form[formFieldName] as FormInputState
        const formFieldConfigProps = this.props.formConfig[formFieldName] as FormInputConfigProps
        const shouldLiveCheck = Boolean(formField.hasError) || this.isFormValid
        const valueParser = (this.props.formConfig[formFieldName] as FormInputConfigProps).liveParser
        const newValue = valueParser
            ? valueParser(value)
            : value

        const isValid = shouldLiveCheck
            ? this.validateField(formFieldName, newValue)
            : formField.isValid

        const hasValidCompare = isValid && shouldLiveCheck && Boolean(formFieldConfigProps.compareWith)
            ? this.fieldHasValidCompares(formFieldName, formFieldConfigProps.compareWith!.fieldName, value)
            : true

        const errorMessage = !isValid && shouldLiveCheck
            ? this.getFieldErrorMessage(formFieldName, newValue)
            : !hasValidCompare
                ? formFieldConfigProps.compareWith && formFieldConfigProps.compareWith.errorMessage
                : undefined

        const isPristine = !(value !== (this.props.formConfig[formFieldName] as FormInputConfigProps).value)

        const comparedFieldState = formFieldConfigProps.compareWith && (errorMessage || isValid)
            ? this.validateComparedFields(value, formFieldConfigProps.compareWith.fieldName)
            : {}

        this.updateState({
            ...this.state.form,
            ...comparedFieldState,
            [formFieldName]: {
                ...this.state.form[formFieldName],
                value: newValue,
                isValid,
                hasError: errorMessage,
                isPristine
            },
        })
    }

    onInputBlur(fieldName: string) {
        const currentValue = ((this.state.form[fieldName] as FormInputState).value).trim()
        const isValid = this.validateField(fieldName, currentValue)
        const formFieldConfigProps = this.props.formConfig[fieldName] as FormInputConfigProps

        // isValid and compareWith exists and not comparedWithIsPristine
        const hasValidCompare = isValid && Boolean(formFieldConfigProps.compareWith) && !this.state.form[formFieldConfigProps.compareWith!.fieldName].isPristine
            ? this.fieldHasValidCompares(fieldName, formFieldConfigProps.compareWith!.fieldName, currentValue)
            : true

        const errorMessage = !isValid
            ? this.getFieldErrorMessage(fieldName, currentValue)
            : !hasValidCompare
                ? formFieldConfigProps.compareWith && formFieldConfigProps.compareWith.errorMessage
                : undefined

        const isPristine = !(currentValue !== (this.props.formConfig[fieldName] as FormInputConfigProps).value)

        this.updateState({
            ...this.state.form,
            [fieldName]: {
                ...this.state.form[fieldName],
                isValid,
                hasError: errorMessage,
                value: currentValue,
                isPristine
            } as FormInputState
        })
    }

    handlePickerOptionChange(fieldName: string, option: CustomPickerOption) {
        const pickerConfig = this.props.formConfig[fieldName] as FormCustomPickerConfigProps
        const isSingleValueMode = pickerConfig.pickerMode === CustomPickerMode.Single
        const currentPickerState = this.state.form[fieldName] as FormCustomPickerState

        const updatedPickerOptions = currentPickerState.options.map(currentStateOption => {
            if (isSingleValueMode) {
                return currentStateOption.value === option.value
                    ? option
                    : {
                        ...currentStateOption,
                        isSelected: false
                    }
            }

            return currentStateOption.value === option.value
                ? option
                : currentStateOption
        })

        const comparator = (optionA: CustomPickerOption, optionB: CustomPickerOption) => optionA.value === optionB.value && optionA.isSelected === optionB.isSelected
        const isPristine = !R.hasElements(R.differenceWith(comparator, updatedPickerOptions, pickerConfig.options))

        return this.updateState({
            ...this.state.form,
            [fieldName]: {
                ...currentPickerState,
                hasError: undefined,
                isPristine,
                options: updatedPickerOptions
            }
        })
    }

    handleCheckboxChange(fieldName: string) {
        const newValue = !(this.state.form[fieldName] as FormCheckboxState).value

        this.updateState({
            ...this.state.form,
            [fieldName]: {
                ...this.state.form[fieldName],
                value: newValue,
                isPristine: false,
                hasError: this.getCheckboxErrorMessage(fieldName, newValue)
            }
        })
    }

    renderChild(child: React.ReactNode) {
        if (R.is(String, child) || R.is(Number, child) || child === null) {
            return child
        }

        const reactElementChild = child as React.ReactElement<any> // tslint:disable-line no-any

        if (reactElementChild.type === Input) {
            const { formConfig, isLoading } = this.props
            const fieldName = reactElementChild.props.formFieldName
            const configProps = formConfig[fieldName] as FormInputConfigProps
            const { inputProps } = (reactElementChild as React.ReactElement<InputProps>).props
            const customInputStyles = inputProps && inputProps.style ? inputProps.style : {}
            const formConfigStyles = configProps.inputProps && configProps.inputProps.style ? configProps.inputProps.style : {}

            return React.cloneElement<InputProps>(reactElementChild, {
                ...reactElementChild.props,
                withError: this.state.form[fieldName].hasError,
                inputProps: {
                    disabled: Boolean(isLoading),
                    ...configProps.inputProps,
                    style: {
                        ...formConfigStyles,
                        ...customInputStyles
                    },
                    value: (this.state.form[fieldName] as FormInputState).value,
                    onChange: ({ currentTarget }) => this.onTextChange(currentTarget.value, fieldName),
                    onBlur: () => this.onInputBlur(fieldName)
                }
            })
        }

        if (reactElementChild.type === CustomField) {
            const fieldName = reactElementChild.props.formFieldName

            return React.cloneElement<CustomFieldProps>(reactElementChild, {
                ...reactElementChild.props,
                withError: this.state.form[fieldName].hasError,
                value: (this.state.form[fieldName] as FormInputState).value,
                onChange: value => this.onTextChange(value, fieldName),
                onBlur: () => this.onInputBlur(fieldName)
            })
        }

        if (reactElementChild.type === CustomPicker) {
            const fieldName = reactElementChild.props.formFieldName
            const pickerState = (this.state.form[fieldName] as FormCustomPickerState)

            return React.cloneElement<CustomPickerProps>(reactElementChild, {
                ...reactElementChild.props,
                withError: this.state.form[fieldName].hasError,
                options: pickerState.options,
                onOptionChange: option => this.handlePickerOptionChange(fieldName, option)
            })
        }

        if (reactElementChild.type === Checkbox) {
            const fieldName = reactElementChild.props.formFieldName

            return React.cloneElement<CheckboxProps>(reactElementChild, {
                ...reactElementChild.props,
                withError: this.state.form[fieldName].hasError,
                isSelected: (this.state.form[fieldName] as FormCheckboxState).value,
                onClick: () => this.handleCheckboxChange(fieldName)
            })
        }

        const reactElementChildren = reactElementChild.props.children

        if (reactElementChildren) {
            const newChildren = React.Children.map(reactElementChildren, this.renderChild) as ReactNode

            return React.cloneElement(reactElementChild, reactElementChild.props, newChildren)
        }

        return reactElementChild
    }

    renderForm() {
        const { children } = this.props

        if (!children) {
            throw new Error('children are mandatory')
        }

        return React.Children.map(this.props.children, this.renderChild)
    }

    render() {
        return (
            <div
                style={{
                    ...styles.container,
                    ...this.props.customFormContainerStyles
                }}
            >
                {this.renderForm()}
            </div>
        )
    }
}

const styles = {
    container: {
        width: '100%'
    }
}
