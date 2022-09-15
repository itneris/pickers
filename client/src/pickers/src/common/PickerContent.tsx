import React from "react";
import IPickerContentProps from "../props/IPickerContentProps";
import "./PickerContent.css"

const PickerContent = (props: IPickerContentProps) => {
    return <div className="itn-picker-content">
        {props.children}
    </div>;
}

PickerContent.defaultProps = {
}

export default PickerContent;