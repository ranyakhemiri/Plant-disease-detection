/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps, useAuth } from "@aws-amplify/ui-react/internal";
import { Image, Text, View } from "@aws-amplify/ui-react";
export default function Indexpage(props) {
  const { overrides, ...rest } = props;
  const authAttributes = useAuth().user?.attributes ?? {};
  return (
    <View
      width="1155px"
      height="562px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      position="relative"
      padding="0px 0px 0px 0px"
      {...getOverrideProps(overrides, "Indexpage")}
      {...rest}
    >
      <View
        width="1155px"
        height="562px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        position="absolute"
        top="0%"
        bottom="0%"
        left="0%"
        right="0%"
        padding="0px 0px 0px 0px"
        backgroundColor="rgba(190,201,179,1)"
        {...getOverrideProps(overrides, "page")}
      ></View>
      <View
        width="193px"
        height="67px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        position="absolute"
        top="52.14%"
        bottom="35.94%"
        left="41.65%"
        right="41.65%"
        border="1px SOLID rgba(0,0,0,1)"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        padding="0px 0px 0px 0px"
        backgroundColor="rgba(217,217,217,1)"
        {...getOverrideProps(overrides, "upload button")}
      ></View>
      <Text
        fontFamily="Cabin"
        fontSize="20px"
        fontWeight="400"
        color="rgba(0,0,0,1)"
        lineHeight="24.30000114440918px"
        textAlign="center"
        display="block"
        direction="column"
        justifyContent="unset"
        width="149px"
        height="31px"
        gap="unset"
        alignItems="unset"
        position="absolute"
        top="55.34%"
        bottom="39.15%"
        left="43.55%"
        right="43.55%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="upload image "
        {...getOverrideProps(overrides, "upload image")}
      ></Text>
      <Text
        fontFamily="Cabin"
        fontSize="48px"
        fontWeight="400"
        color="rgba(255,255,255,1)"
        lineHeight="58.31999969482422px"
        textAlign="left"
        display="block"
        direction="column"
        justifyContent="unset"
        width="488px"
        height="55px"
        gap="unset"
        alignItems="unset"
        position="absolute"
        top="9.79%"
        bottom="80.43%"
        left="26.32%"
        right="31.43%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="Plant Disease Detection"
        {...getOverrideProps(overrides, "title")}
      ></Text>
      <Image
        width="6.49%"
        height="8.19%"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        position="absolute"
        top="11.39%"
        bottom="80.43%"
        left="69.96%"
        right="23.55%"
        padding="0px 0px 0px 0px"
        objectFit="contain"
        src={authAttributes["email"]}
        {...getOverrideProps(overrides, "aws logo")}
      ></Image>
    </View>
  );
}
