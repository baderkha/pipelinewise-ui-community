import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Autocomplete,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import TableChartIcon from "@mui/icons-material/TableChart";
import SearchIcon from "@mui/icons-material/Search";

// Example schema metadata (replace with backend response later)
const schemaMetadata = {
  mydb: {
    users: [
      { name: "id", type: "INTEGER" },
      { name: "created_at", type: "TIMESTAMP" },
      { name: "updated_at", type: "TIMESTAMP" },
      { name: "email", type: "VARCHAR" },
      { name: "is_active", type: "BOOLEAN" },
    ],
    orders: [
      { name: "order_id", type: "INTEGER" },
      { name: "user_id", type: "INTEGER" },
      { name: "amount", type: "DECIMAL" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  analytics: {
    events: [
      { name: "event_id", type: "INTEGER" },
      { name: "event_type", type: "VARCHAR" },
      { name: "timestamp", type: "TIMESTAMP" },
    ],
  },
};

export default function CursorSelectorWidget({ onChange }) {
  const [database, setDatabase] = useState("");
  const [table, setTable] = useState("");
  const [cursorField, setCursorField] = useState(null);

  const databases = Object.keys(schemaMetadata);
  const tables = database ? Object.keys(schemaMetadata[database]) : [];
  const fields = database && table ? schemaMetadata[database][table] : [];

  // Notify parent whenever a full selection is made
  React.useEffect(() => {
    if (database && table && cursorField) {
      onChange?.({ database, table, cursor: cursorField });
    }
  }, [database, table, cursorField, onChange]);

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Cursor Field Selector
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Database Selector */}
          <Autocomplete
            fullWidth
            options={databases}
            value={database}
            onChange={(_, newValue) => {
              setDatabase(newValue);
              setTable("");
              setCursorField(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Database"
                placeholder="Select database"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <StorageIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Table Selector */}
          <Autocomplete
            fullWidth
            options={tables}
            value={table}
            onChange={(_, newValue) => {
              setTable(newValue);
              setCursorField(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Table"
                placeholder="Select table"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <TableChartIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            disabled={!database}
          />

          {/* Cursor Field Selector */}
          <Autocomplete
            fullWidth
            options={fields}
            getOptionLabel={(option) => option.name}
            value={cursorField}
            onChange={(_, newValue) => setCursorField(newValue)}
            filterOptions={(options, state) =>
              options.filter((opt) =>
                opt.name.toLowerCase().includes(state.inputValue.toLowerCase())
              )
            }
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.type}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cursor Field"
                placeholder="Search field..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            disabled={!table}
          />
        </Box>

        {/* Show selection summary */}
        {cursorField && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
            <Typography variant="subtitle1">
              ✅ Selected Cursor Field:
            </Typography>
            <Typography>
              DB: {database} | Table: {table} | Field: {cursorField.name} (
              {cursorField.type})
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
