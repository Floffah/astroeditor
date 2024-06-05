"use client";

import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import {
    Icon as IconifyIcon,
    IconProps as IconifyIconProps,
} from "@iconify/react";
import { forwardRef, useMemo } from "react";

export interface IconProps extends IconifyIconProps {
    label: string;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ icon, label: propsLabel, ...props }, ref) => {
        const label = useMemo(() => {
            if (propsLabel.includes("icon")) {
                return propsLabel;
            }

            return propsLabel + " (icon)";
        }, [propsLabel]);

        return (
            <AccessibleIcon.Root label={label}>
                <IconifyIcon ref={ref as any} icon={icon} {...props} />
            </AccessibleIcon.Root>
        );
    },
);