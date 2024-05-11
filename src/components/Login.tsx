import { Button, Card, TextInput } from "@mantine/core";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { log } from "../slices/logIn";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
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
          onClick={() => {
            dispatch(log({ name: value, step: 1 }));
            navigate("play");
          }}
        >
          Enter the game
        </Button>
      </Card>
    </>
  );
};
