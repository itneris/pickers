import IPickerBaseProps from "./IPickerBaseProps";

export default interface ITimePickerBaseProps extends IPickerBaseProps {
    timeEditMode?: "normal" | "onlyMinutes" | "onlyHours";
    amPm?: boolean;
}