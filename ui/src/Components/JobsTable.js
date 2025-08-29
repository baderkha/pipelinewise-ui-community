import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import cronstrue from "cronstrue";

/**
 * @typedef {"pass" | "fail" | "running"} JobStatus
 *
 * @typedef {Object} Job
 * @property {string} name - Job name
 * @property {string} tap - Source (Tap) system
 * @property {string} target - Destination (Target) system
 * @property {JobStatus} status - Last run status
 * @property {string} cron - Cron expression for job schedule
 */

/**
 * JobsTable component displays a sortable table of jobs.
 *
 * @param {Object} props - Component props
 * @param {Job[]} props.jobs - Array of job objects
 * @returns {JSX.Element}
 */
export default function JobsTable({ jobs }) {
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const renderStatus = (status) => {
    switch (status) {
      case "pass":
        return <CheckCircleIcon sx={{ color: "green" }} />;
      case "fail":
        return <ErrorIcon sx={{ color: "red" }} />;
      case "running":
        return <AutorenewIcon sx={{ color: "orange" }} className="spin" />;
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#00897b" }}>
          <TableRow>
            {["name", "tap", "target", "status", "cron"].map((col) => (
              <TableCell
                key={col}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {col !== "cron" ? (
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col)}
                    sx={{
                      color: "white",
                      "& .MuiTableSortLabel-icon": {
                        color: "white !important",
                      },
                    }}
                  >
                    {col === "name" && "Name"}
                    {col === "tap" && "Tap"}
                    {col === "target" && "Target"}
                    {col === "status" && "Last Run Status"}
                  </TableSortLabel>
                ) : (
                  "Schedule"
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedJobs.map((job, index) => (
            <TableRow
              key={index}
              hover
              selected={selectedRow === index}
              onClick={() => setSelectedRow(index)}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              sx={{
                cursor: "pointer",
                "&.Mui-selected": { backgroundColor: "#bbdefb !important" }, // blue selected
                "&:hover": { backgroundColor: "#e3f2fd" }, // light blue hover
              }}
            >
              <TableCell>{job.name}</TableCell>
              <TableCell>{job.tap}</TableCell>
              <TableCell>{job.target}</TableCell>
              <TableCell>{renderStatus(job.status)}</TableCell>
              <TableCell>
                {(() => {
                  try {
                    return cronstrue.toString(job.cron, { use24HourTimeFormat: true });
                  } catch (e) {
                    return "Invalid cron";
                  }
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
