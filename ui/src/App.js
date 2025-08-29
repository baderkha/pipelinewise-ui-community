import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/SideBar";
import JobsPage from "./Components/JobsTable";
import JobsTable from "./Components/JobsTable";
import { Box } from "@mui/material";

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <Sidebar></Sidebar>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            padding: "20px",
          }}
        >
          <JobsTable
            jobs={[
              {
                name: "Daily Sync",
                tap: "MySQL",
                target: "Snowflake",
                status: "pass",
                cron: "0 2 * * *",
              },
              {
                name: "Weekly Sync",
                tap: "Postgres",
                target: "Redshift",
                status: "fail",
                cron: "0 5 * * 1",
              },
              {
                name: "Adhoc Run",
                tap: "MongoDB",
                target: "BigQuery",
                status: "running",
                cron: "*/10 * * * *",
              },
            ]}
          ></JobsTable>
        </div>
      </div>
    </div>
  );
}

export default App;
