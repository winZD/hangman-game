import { useEffect } from "react";
import { useAppDispatch } from "./Game";
import { getHighscoresThunk } from "../slices/highscores";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Table } from "@mantine/core";
import { UserHighscore } from "../services/getHighscores";

export const Highscores = () => {
  const highscores = useSelector((state: RootState) => state.highscores.data);
  const dispatch = useAppDispatch();

  const sortByHighscore = (data: UserHighscore[]) => {
    if (data.length) {
      const sortedHighscores = [...data].sort((a, b) => {
        // Calculate score for each element
        const scoreA = 100 / 1 + a.errors;
        const scoreB = 100 / 1 + b.errors;

        // Sort in ascending order (highest to lovest)
        return scoreB - scoreA;
      });
      return sortedHighscores;
    }
    return [];
  };

  const rows = sortByHighscore(highscores).map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.userName}</Table.Td>
      <Table.Td>{100 / 1 + element.errors}</Table.Td>
    </Table.Tr>
  ));

  console.log(highscores);
  useEffect(() => {
    dispatch(getHighscoresThunk());
  }, []);
  return (
    <div>
      {" "}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User name</Table.Th>
            <Table.Th>highscore</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
