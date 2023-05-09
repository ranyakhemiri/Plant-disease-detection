/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PageLoginOverridesProps = {
    PageLogin?: PrimitiveOverrideProps<ViewProps>;
    "Login page"?: PrimitiveOverrideProps<ViewProps>;
    "login page"?: PrimitiveOverrideProps<ViewProps>;
    email222?: PrimitiveOverrideProps<ViewProps>;
    "login btn"?: PrimitiveOverrideProps<ViewProps>;
    "login title"?: PrimitiveOverrideProps<TextProps>;
    login?: PrimitiveOverrideProps<TextProps>;
    pwd?: PrimitiveOverrideProps<ViewProps>;
    email225?: PrimitiveOverrideProps<TextProps>;
    password?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type PageLoginProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: PageLoginOverridesProps | undefined | null;
}>;
export default function PageLogin(props: PageLoginProps): React.ReactElement;
