import { Toolbar } from "@mui/material";
import React from "react";
import IPickerToolbarProps from "../props/IPickerToolbarProps";
import "./PickerToolbar.css";

const PickerToolbar = (props: IPickerToolbarProps) => {

    if (!props.disableToolbar) {
        return <Toolbar
            classes={{
                root: `${props.className} itn-picker-toolbar ${props.orientation === "landscape" ? "itn-picker-toolbar-landscape" : ""}`
            }}
            sx={theme => ({
                //@ts-ignore
                backgroundColor: theme.palette[props.color].main
            })}
            style={props.style}
        >
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