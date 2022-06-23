import tw from "twin.macro";
import styled from "styled-components";
import { useState } from "react";

function App() {
  const list = [];
  let total;

  const [current, setCurrentSituation] = useState("Not Started"); //Running, Stopped, Not Started
  const [startTime, setStartTime] = useState();
  const [stopTime, setStopTime] = useState();

  const [activityLog, setActivity] = useState([]);

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
  }

  const Container = styled.section.attrs({
    className: " ",
  })`
    & button {
      ${tw`inline-flex items-center justify-center px-5 py-3 rounded-md no-underline inline-flex rounded-md shadow`}
    }
    & .active {
      ${tw`text-white bg-indigo-600 hover:bg-indigo-700`}
    }
    & .reset {
      ${tw`ml-3 text-indigo-600 bg-white hover:bg-indigo-50`}
    }
    & h1 {
      ${tw`text-9xl my-6`}
    }
    & h2 {
      ${tw`text-3xl font-extrabold sm:text-4xl`}
      & span {
        ${tw`block mt-1`}
      }
    }
    & table {
      ${tw`table mt-20 p-1`}
    }
  `;

  const handleClick = (CurrentSituation) => {
    if (CurrentSituation === "Running") {
      setStopTime(Date.now());
      setCurrentSituation("Stopped");

      return setActivity([...activityLog, { startTime, stopTime: Date.now() }]);
    } else {
      setStartTime(Date.now());

      return setCurrentSituation("Running");
    }
  };

  const handleReset = (CurrentSituation) => {
    if (CurrentSituation === "Running") {
      setStopTime(Date.now());
      setActivity([...activityLog, { startTime, stopTime: Date.now() }]);
      setCurrentSituation("Stopped");

      let confirm = window.confirm("Are you sure to reset the stopwatch?");
      if (confirm) {
        setCurrentSituation("Not Started");
        setActivity([]);
      } else
        window.alert(
          "Stopwatch is not reset, just stopped. If you want to reset, please click the button again."
        );
    } else {
      setCurrentSituation("Not Started");
      return setActivity([]);
    }
  };

  for (let i = 0; i < activityLog.length; i++) {
    list.push(activityLog[i].stopTime - activityLog[i].startTime);
    total = list.reduce((a, b) => a + b, 0);
  }

  console.log(list, convertMsToTime(total));

  return (
    <Container>
      <h2> {current === "Running" ? "Stop and see elapsed time" : " "}</h2>
      <h1 className={current !== "Not Started" ? " " : "hidden"}>
        {current === "Running" ? " " : convertMsToTime(total)}
      </h1>
      <h2 className={current === "Not Started" ? " " : "hidden"}>
        <span>Do you want to start a stopwatch?</span>
        <span className="text-indigo-600">Just a click ⏰</span>
      </h2>
      <div>
        <button
          className="active"
          onClick={() => {
            handleClick(current);
          }}
        >
          {current === "Running" ? "Stop" : "Start"}
        </button>

        {current === "Not Started" ? (
          ""
        ) : (
          <button
            className="reset"
            onClick={() => {
              handleReset(current);
            }}
          >
            Reset
          </button>
        )}
      </div>

      {list.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Start Time</th>
              <th>Stop Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.map((activity, index) => {
              const start = new Date(activity.startTime);
              const stop = new Date(activity.stopTime);

              return (
                <tr>
                  <td>
                    <b>{index + 1}</b>
                  </td>
                  <td>{start.toLocaleString()}</td>
                  <td>{stop.toLocaleString()}</td>
                  <td>{list[index] / 1000} seconds</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
