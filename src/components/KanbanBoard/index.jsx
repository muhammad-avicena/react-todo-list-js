import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import API_URL from "../../utils/API_URL";
import Column from "./Column";
import axios from "axios";

import { Button } from "@mui/material";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF2aWNlbmEiLCJpZCI6IjY1MzczMzk1NzZlYzA1MzI5ZDNiNWJlZiIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE2OTgzMzk0OTcsImV4cCI6MTY5ODQyNTg5N30.Il2AMLprOR-QNQhMhbCxLaUK_lvHfdfITqRClLwzjIA";

  const fetchAndProcessData = useCallback(() => {
    axios
      .get(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const completedTasks = [];
        const incompleteTasks = [];
        const inProgressTasks = [];

        data.forEach((task) => {
          if (task.status === "Completed") {
            completedTasks.push(task);
          } else if (task.status === "Not Started") {
            incompleteTasks.push(task);
          } else if (task.status === "In Progress") {
            inProgressTasks.push(task);
          }
        });

        setCompleted(completedTasks);
        setIncomplete(incompleteTasks);
        setInProgress(inProgressTasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (source.droppableId == destination.droppableId) return;

    // REMOVE FROM SOURCE ARRAY
    if (source.droppableId == 3) {
      setCompleted(removeItemById(draggableId, completed));
    } else if (source.droppableId == 2) {
      setInProgress(removeItemById(draggableId, inProgress));
    } else {
      setIncomplete(removeItemById(draggableId, incomplete));
    }

    //ADD ITEM
    if (destination.droppableId == 3) {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "Completed",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (destination.droppableId == 2) {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "In Progress",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(
          `${API_URL}/todos/${draggableId}`,
          {
            status: "Not Started",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchAndProcessData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function findItemById(_id, array) {
    return array.find((item) => item._id == _id);
  }

  function removeItemById(_id, array) {
    return array.filter((item) => item._id != _id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center", color: "dark" }}>PROGRESS BOARD</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Column
          title={"TO DO"}
          tasks={incomplete}
          id={"1"}
          fetchData={fetchAndProcessData}
        />
        <Column
          title={"IN PROGRESS"}
          tasks={inProgress}
          id={"2"}
          fetchData={fetchAndProcessData}
        />
        <Column
          title={"DONE"}
          tasks={completed}
          id={"3"}
          fetchData={fetchAndProcessData}
        />
      </div>
    </DragDropContext>
  );
}
