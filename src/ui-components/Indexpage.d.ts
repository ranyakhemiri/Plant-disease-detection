/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { ImageProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type IndexpageOverridesProps = {
    Indexpage?: PrimitiveOverrideProps<ViewProps>;
    page?: PrimitiveOverrideProps<ViewProps>;
    "upload button"?: PrimitiveOverrideProps<ViewProps>;
    "upload image"?: PrimitiveOverrideProps<TextProps>;
    title?: PrimitiveOverrideProps<TextProps>;
    "aws logo"?: PrimitiveOverrideProps<ImageProps>;
} & EscapeHatchProps;
export declare type IndexpageProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: IndexpageOverridesProps | undefined | null;
}>;
export default function Indexpage(props: IndexpageProps): React.ReactElement;
