import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import API_URL from "../utils/API_URL";
import Column from "./Column";
import axios from "axios";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF2aWNlbmExIiwiaWQiOiI2NTM3YzQxMDQ2ZmM5YWI1MzFmYzUyNmQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTgyNTA0MzksImV4cCI6MTY5ODMzNjgzOX0.zfqUuCxHQ8FnSzPdWhQYU0NsH6cmC4oQeN18AtN2eW4";

  useEffect(() => {
    axios
      .get(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        data.forEach((task) => {
          if (task.status === "Completed") {
            setCompleted((completed) => [...completed, task]);
          } else if (task.status === "Not Started") {
            setIncomplete((incomplete) => [...incomplete, task]);
          } else if (task.status === "In Progress") {
            setInProgress((inProgress) => [...inProgress, task]);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

    // GET ITEM
    const task = findItemById(draggableId, [
      ...incomplete,
      ...completed,
      ...inProgress,
    ]);

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
          setCompleted([{ ...task, status: "Completed" }, ...completed]);
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
          setInProgress([{ ...task, status: "In Progress" }, ...inProgress]);
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
          setIncomplete([{ ...task, status: "Not Started" }, ...incomplete]);
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
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Column title={"TO DO"} tasks={incomplete} id={"1"} />
        <Column title={"IN PROGRESS"} tasks={inProgress} id={"2"} />
        <Column title={"DONE"} tasks={completed} id={"3"} />
      </div>
    </DragDropContext>
  );
}
