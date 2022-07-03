import React from "react";
import { GQLErrorGroup } from "@kurtbuilds/lib";
import { Alert } from "@kurtbuilds/lib";
export declare type ErrorStrings = null | string[];
/**
 * Defines the type of the error object.
 */
export declare type FieldErrorMap<T> = {
    [P in keyof T]: ErrorStrings;
};
export declare type FieldValueSetter = (e: React.ChangeEvent<HTMLInputElement>) => void;
/**
 * Defines the type of the set_<field> functions on the FormState object.
 */
export declare type FieldValueSetters<T> = {
    [P in keyof T as `set_${string & P}`]: FieldValueSetter;
};
/**
 * Defines the type of the add_<field>_error functions on the FormState object.
 */
export declare type FieldErrorSetters<T> = {
    [P in keyof T as `set_${string & P}_errors`]: (e: string) => void;
};
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
export declare type FormState<T> = T & FieldValueSetters<T> & FieldErrorSetters<T> & {
    errors: FieldErrorMap<T>;
    form_data: T;
    form_alerts: Alert[] | null;
    set_form_errors: (e: string | string[]) => void;
    set_form_errors_from_gql: (e: GQLErrorGroup) => void;
    set_form_success: (message: string) => void;
    set_form_data: (t: Partial<T>) => void;
};
export declare function useFormState<T>(initial: T): FormState<T>;
