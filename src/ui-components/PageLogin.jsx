/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  getOverrideProps,
  useNavigateAction,
} from "@aws-amplify/ui-react/internal";
import { Text, View } from "@aws-amplify/ui-react";
export default function PageLogin(props) {
  const { overrides, ...rest } = props;
  const loginbtnOnClick = useNavigateAction({ type: "url", url: "index.html" });
  return (
    <View
      width="1155px"
      height="562px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      overflow="hidden"
      position="relative"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(255,255,255,1)"
      {...getOverrideProps(overrides, "PageLogin")}
      {...rest}
    >
      <View
        padding="0px 0px 0px 0px"
        width="1155px"
        height="562px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        position="absolute"
        top="0px"
        left="0px"
        {...getOverrideProps(overrides, "Login page")}
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
          backgroundColor="rgba(120,136,104,1)"
          {...getOverrideProps(overrides, "login page")}
        ></View>
        <View
          width="399px"
          height="73px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="162px"
          left="378px"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(217,217,217,1)"
          {...getOverrideProps(overrides, "email222")}
        ></View>
        <View
          width="171px"
          height="73px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="388px"
          left="492px"
          border="1px SOLID rgba(0,0,0,1)"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(217,217,217,1)"
          onClick={() => {
            loginbtnOnClick();
          }}
          {...getOverrideProps(overrides, "login btn")}
        ></View>
        <Text
          fontFamily="Cabin"
          fontSize="48px"
          fontWeight="400"
          color="rgba(255,255,255,1)"
          lineHeight="58.31999969482422px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="488px"
          height="55px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="6.05%"
          bottom="84.16%"
          left="28.83%"
          right="28.92%"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Login"
          {...getOverrideProps(overrides, "login title")}
        ></Text>
        <Text
          fontFamily="Cabin"
          fontSize="32px"
          fontWeight="400"
          color="rgba(23,22,22,1)"
          lineHeight="38.880001068115234px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="145px"
          height="39px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="405px"
          left="505px"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="login"
          {...getOverrideProps(overrides, "login")}
        ></Text>
        <View
          width="399px"
          height="73px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="258px"
          left="378px"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(217,217,217,1)"
          {...getOverrideProps(overrides, "pwd")}
        ></View>
        <Text
          fontFamily="Cabin"
          fontSize="32px"
          fontWeight="400"
          color="rgba(152,142,142,1)"
          lineHeight="38.880001068115234px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="382px"
          height="63px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="172px"
          left="395px"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="email"
          {...getOverrideProps(overrides, "email225")}
        ></Text>
        <Text
          fontFamily="Cabin"
          fontSize="32px"
          fontWeight="400"
          color="rgba(152,142,142,1)"
          lineHeight="38.880001068115234px"
          textAlign="left"
          display="block"
          direction="column"
          justifyContent="unset"
          width="382px"
          height="63px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="268px"
          left="386px"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="password"
          {...getOverrideProps(overrides, "password")}
        ></Text>
      </View>
    </View>
  );
}
