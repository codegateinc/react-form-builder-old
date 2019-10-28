import { R } from 'lib/utils'
import {
    FieldState,
    FormBuilderState, FormCheckboxConfigProps,
    FormConfig,
    FormCustomPickerConfigProps,
    FormField,
    FormInputConfigProps
} from './types'

export const prepareFormInitialState = (formConfig: FormConfig) => {
    const preparedPairs = R.toPairs(formConfig)
        .map(([ fieldName, config ]) => {
            if (config.fieldType === FormField.Input) {
                const inputConfig = config as FormInputConfigProps
                const isValidInputValue = R.is(String, inputConfig.value) || R.is(Number, inputConfig.value)

                return [fieldName, {
                    isValid: Boolean(inputConfig.value),
                    isRequired: config.isRequired,
                    value: isValidInputValue ? inputConfig.value : '',
                    fieldType: config.fieldType,
                    isPristine: true
                }]
            }

            if (config.fieldType === FormField.Checkbox) {
                const checkboxConfig = config as FormCheckboxConfigProps

                return [fieldName, {
                    isRequired: config.isRequired,
                    value: checkboxConfig.value,
                    fieldType: checkboxConfig.fieldType,
                    isPristine: true,
                }]
            }

            // CustomPicker
            const customPickerConfig = config as FormCustomPickerConfigProps

            return [fieldName, {
                fieldType: customPickerConfig.fieldType,
                isRequired: customPickerConfig.isRequired,
                options: customPickerConfig.options,
                isPristine: true
            }]
        }) as Array<[string, FieldState]>

    return R.fromPairs(preparedPairs)
}

export const getFormErrors = (formState: FormBuilderState) => R.toPairs(formState)
    .filter(([, fieldState]) => Boolean(fieldState.hasError))
    .reduce((acc, [fieldName, fieldState]) => ({
        ...acc,
        [fieldName]: fieldState.hasError
    }), {})
