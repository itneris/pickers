import { Paper } from "@mui/material";
import format from "date-fns/format";
import React, { useState } from "react";
import { DatePicker } from "./pickers/src";

const TestComnonent = () => {
    const [date, setDate] = useState<string>(new Date().toISOString());

    return (
        <>

            <div>DatePicker с выбранным значением: {format(new Date(date), "dd MMMM yyyy")}</div>
            <Paper square sx={{ maxWidth: 290 }}>
                <DatePicker color="secondary" value={date} onChange={setDate} pickerVariant="static" />
            </Paper>
        </>
    );
}

export default TestComnonent;