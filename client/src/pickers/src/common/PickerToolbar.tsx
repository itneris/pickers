import { useTheme } from "@emotion/react";
import { Toolbar } from "@mui/material";
import React from "react";
import IPickerToolbarProps from "../props/IPickerToolbarProps";

const PickerToolbar = (props: IPickerToolbarProps) => {
    const theme = useTheme();

    if (!props.disableToolbar) {
        return <Toolbar>
            {props.children}
        </Toolbar>
    } else {
        return null;
    }
}

PickerToolbar.defaultProps = {
    disableToolbar: false
}

export default PickerToolbar;