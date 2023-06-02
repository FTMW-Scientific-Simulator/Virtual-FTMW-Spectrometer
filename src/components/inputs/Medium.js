import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { CustomSwitch } from "./custom/CustomSwitch";

// redux
import { useDispatch } from "react-redux";
import { updateMedium } from "../../features/parameterSlice";

// this input component sets the medium to 'vacuum' or 'air'
export default function Medium({ parameter }) {
  const dispatch = useDispatch();

  const handleChange = (event, newAlignment) => {
    newAlignment
      ? dispatch(updateMedium("Air"))
      : dispatch(updateMedium("Vacuum"));
  };

  const label = {
    inputProps: { "aria-label": "Medium" },
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Medium</FormLabel>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Vacuum</Typography>
        <CustomSwitch
          {...label}
          onChange={handleChange}
          checked={parameter === "Air" ? true : false}
        />
        <Typography>Air</Typography>
      </Stack>
    </FormControl>
  );
}
