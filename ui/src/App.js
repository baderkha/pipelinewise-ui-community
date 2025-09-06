import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/SideBar";
import JobsPage from "./Components/JobsTable";
import JobsTable from "./Components/JobsTable";
import { Box } from "@mui/material";
import MYSQLTap from "./Components/Tap/MYSQLTap";
import SnowflakeTarget from "./Components/Target/SnowflakeTarget";
import SourceSyncWidget from "./Components/SourcesToSync/SourcesToSync";

const fakeTables = Array.from({ length: 40 }).map((_, i) => ({
  name: `table_${i + 1}`,
  fields: [
    { name: "id", type: "INTEGER" },
    { name: "created_at", type: "TIMESTAMP" },
    { name: "updated_at", type: "TIMESTAMP" },
    { name: "name", type: "VARCHAR" },
  ],
}));

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
          <SourceSyncWidget
            loadTableInfo={() => fakeTables}
            onSave={(config) => {
              console.log("✅ Saved config:", config);
              alert("Saved configuration! Check console.");
            }}
            onRefresh={() => {
              console.log("🔄 Refresh triggered");
              alert("Tables refreshed!");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
