/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type LoginFormInputValues = {};
export declare type LoginFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LoginFormOverridesProps = {
    LoginFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type LoginFormProps = React.PropsWithChildren<{
    overrides?: LoginFormOverridesProps | undefined | null;
} & {
    onSubmit: (fields: LoginFormInputValues) => void;
    onChange?: (fields: LoginFormInputValues) => LoginFormInputValues;
    onValidate?: LoginFormValidationValues;
} & React.CSSProperties>;
export default function LoginForm(props: LoginFormProps): React.ReactElement;
