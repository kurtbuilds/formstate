import React, {useState} from "react";
import {GQLErrorGroup} from "@kurtbuilds/lib"
import {Alert} from "@kurtbuilds/lib";


export type ErrorStrings = null | string[]

/**
 * Defines the type of the error object.
 */
export type FieldErrorMap<T> = { [P in keyof T]: ErrorStrings }

export type FieldValueSetter = (e: React.ChangeEvent<HTMLInputElement>) => void
/**
 * Defines the type of the set_<field> functions on the FormState object.
 */
export type FieldValueSetters<T> = {
    [P in keyof T as `set_${string & P}`]:  FieldValueSetter
}

/**
 * Defines the type of the add_<field>_error functions on the FormState object.
 */
export type FieldErrorSetters<T> = {
    [P in keyof T as `set_${string & P}_errors`]: (e: string) => void
}

/**
 * Defines all fields on the FormState returned by useFormState.
 *
 * Example:
 * FormState<{
 *     email: string,
 *     password: string,
 * }>
 *
 * looks like the following:
 * {
 *     // actual data for the form
 *     email: string,
 *     password: string,
 *
 *     // setters to pass to onChange handlers on <input> tags.
 *     set_email: (e :React.ChangeEvent<HTMLInputElementA>) => void,
 *     set_password: (e :React.ChangeEvent<HTMLInputElementA>) => void,
 *
 *     // handlers to add error data to each field
 *     set_email_error: (e: string) => void,
 *     set_password_error: (e: string) => void,
 *
 *     // dictionary of error data. used like so:
 *     //    {form.errors.email ? form.errors.email.map(e => <YourErrorComponent err={e}/>) : null}
 *     errors: {
 *         email: null | string[],
 *         password: null | string[],
 *     }
 * }
 */


export type FormState<T> = T & FieldValueSetters<T> & FieldErrorSetters<T> & {
    errors: FieldErrorMap<T>,
    form_data: T,
    form_alerts: Alert[] | null
    set_form_errors: (e: string | string[]) => void,
    set_form_errors_from_gql: (e: GQLErrorGroup) => void,
    set_form_success: (message: string) => void,
    set_form_data: (t: Partial<T>) => void
}


type Map<T> = {[key: string]: T}

function update_key<M, T>(s: M, key: string, v: T): M {
    s = {...s}
    //@ts-ignore
    s[key] = v
    return s
}

export function useFormState<T>(initial: T): FormState<T> {
    let [form, set_form] = useState<T>(initial);
    let [field_errors, set_field_errors] = useState<FieldErrorMap<T>>(Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, null])) as FieldErrorMap<T>)
    let [form_alerts, set_form_alerts] = useState<Alert[] | null>(null)

    let setters = Object.fromEntries(Object.entries(initial).map(([k, v]) => {
        return ['set_' + k, (e: React.ChangeEvent<HTMLInputElement>) => {
            set_field_errors(update_key(field_errors, k, null))
            set_form(update_key(form, k, e.target.value))
        }]
    })) as FieldValueSetters<T>
    let error_setters = Object.fromEntries(Object.entries(initial).map(([k, v]) => {
        return ['set_' + k + '_errors', (e: string | string[]) => {
            set_field_errors(update_key(field_errors, k, Array.isArray(e) ? e : [e]))
        }]
    })) as FieldErrorSetters<T>
    return {
        ...form,
        ...setters,
        ...error_setters,
        set_form_errors: (err: string | string[]) => set_form_alerts(
            Array.isArray(err) ? err.map(e => ({type: 'danger', message: e})) : [{type: 'danger', message: err}],
        ),
        set_form_errors_from_gql: (e: GQLErrorGroup) => set_form_alerts(
            e.errors.map(e => ({type: 'danger', message: e.message}))
        ),
        set_form_success: (message: string) => set_form_alerts(
            [{type: 'success', message}]
        ),
        errors: field_errors,
        form_alerts,
        form_data: form,
    } as FormState<T>
}
