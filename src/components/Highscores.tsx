import { useEffect } from "react";
import { useAppDispatch } from "./Game";
import { getHighscoresThunk } from "../slices/highscores";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Card, Table } from "@mantine/core";
import { UserHighscore } from "../models/userHighscore";

export const Highscores = () => {
  /**
   * Selects the highscores data from the Redux store, providing a fallback to an empty array if the data is undefined.
   * @returns {UserHighscore[]} An array of highscore objects.
   */
  const highscores = useSelector(
    (state: RootState) => state.highscores?.data || []
  );

  /**
   * Custom hook to dispatch actions to the Redux store.
   * @returns {Function} A function that can be used to dispatch actions.
   */
  const dispatch = useAppDispatch();

  /**
   * Sorts an array of UserHighscore objects by their highscore in descending order.
   * @param {UserHighscore[]} data - The array of UserHighscore objects to sort.
   * @returns {UserHighscore[]} The sorted array of UserHighscore objects.
   */
  const sortByHighscore = (data: UserHighscore[]) => {
    if (data.length) {
      const sortedHighscores = [...data]?.sort((a, b) => {
        // Calculate score for each element
        const scoreA = 100 / 1 + a.errors;
        const scoreB = 100 / 1 + b.errors;

        return scoreB - scoreA;
      });
      return sortedHighscores;
    }
    return [];
  };
  /**
   * Maps over the sorted highscores to render them in a table row format.
   * @returns {React.ReactNode[]} An array of React elements representing table rows.
   */
  const rows = sortByHighscore(highscores).map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{100 / 1 + element.errors}</Table.Td>
    </Table.Tr>
  ));

  /**
   * Dispatches the getHighscoresThunk action to fetch highscores from the server.
   * This effect runs once when the component mounts.
   */
  useEffect(() => {
    dispatch(getHighscoresThunk());
  }, []);
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {" "}
      <Table stickyHeader striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ textAlign: "center" }}>User name</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>Highscore</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
};
