import { Button, Card, TextInput } from "@mantine/core";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { log } from "../slices/logIn";
import { useNavigate } from "react-router-dom";

/**
 * The Login component renders a form where users can enter their name.
 * Upon clicking the "Enter the game" button, the entered name is dispatched to the Redux store
 * and the user is navigated to the play page.
 */
export const Login = () => {
  /**
   * State variable to hold the user's input.
   */
  const [value, setValue] = useState("");

  /**
   * Hook to programmatically navigate to different routes.
   */
  const navigate = useNavigate();

  /**
   * Hook to dispatch actions to the Redux store.
   */
  const dispatch = useDispatch();

  /**
   * Renders the login form.
   *
   * @returns {ReactElement} - The rendered login form.
   */

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
          mt="md"
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
