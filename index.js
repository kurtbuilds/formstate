"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormState = void 0;
const react_1 = require("react");
function update_key(s, key, v) {
    s = { ...s };
    //@ts-ignore
    s[key] = v;
    return s;
}
function useFormState(initial) {
    let [form, set_form] = (0, react_1.useState)(initial);
    let [field_errors, set_field_errors] = (0, react_1.useState)(Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, null])));
    let [form_alerts, set_form_alerts] = (0, react_1.useState)(null);
    let setters = Object.fromEntries(Object.entries(initial).map(([k, v]) => {
        return ['set_' + k, (e) => {
                set_field_errors(update_key(field_errors, k, null));
                set_form(update_key(form, k, e.target.value));
            }];
    }));
    let error_setters = Object.fromEntries(Object.entries(initial).map(([k, v]) => {
        return ['set_' + k + '_errors', (e) => {
                set_field_errors(update_key(field_errors, k, Array.isArray(e) ? e : [e]));
            }];
    }));
    return {
        ...form,
        ...setters,
        ...error_setters,
        set_form_errors: (err) => set_form_alerts(Array.isArray(err) ? err.map(e => ({ type: 'danger', message: e })) : [{ type: 'danger', message: err }]),
        set_form_errors_from_gql: (e) => set_form_alerts(e.errors.map(e => ({ type: 'danger', message: e.message }))),
        set_form_success: (message) => set_form_alerts([{ type: 'success', message }]),
        errors: field_errors,
        form_alerts,
        form_data: form,
    };
}
exports.useFormState = useFormState;
//# sourceMappingURL=index.js.map