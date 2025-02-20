'use client';
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ConfigProvider, theme} from "antd";
import React from "react";
import vi_VN from "antd/lib/locale/vi_VN";

export const AntdProvider= ({children}:{children:React.ReactNode}) => {
    return (
        <ConfigProvider locale={vi_VN} componentSize="middle" theme={{
            algorithm:theme.darkAlgorithm
        }}>
            <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
    );
};