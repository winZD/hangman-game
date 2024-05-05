import { Button, TextInput } from "@mantine/core";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { log } from "../slices/logIn";

export const Login = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  return (
    <>
      <div>
        <TextInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          label="Name"
          description="Enter your name"
          placeholder="name"
        />
        <Button
          disabled={!value.length}
          variant="filled"
          onClick={() => dispatch(log({ name: value, step: 1 }))}
        >
          Enter the game
        </Button>
      </div>
    </>
  );
};
