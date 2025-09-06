import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Switch,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Autocomplete,
  InputAdornment,
  TablePagination,
  Checkbox,
  IconButton,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * @typedef {Object} Field
 * @property {string} name - Column name
 * @property {"INTEGER"|"VARCHAR"|"BOOLEAN"|"DATE"|"DATETIME"|"TIMESTAMP"|"DECIMAL"} type - Column type
 */

/**
 * @typedef {Object} TableInfo
 * @property {string} name - Table name
 * @property {Field[]} fields - List of fields
 */

/**
 * @typedef {Object} TableSyncConfigProps
 * @property {() => TableInfo[]} [loadTableInfo] - Function to load table metadata
 * @property {(job: {label: string, cron: string, tables: any[]}) => void} [onSave] - Callback fired when save is clicked
 * @property {() => void} [onRefresh] - Callback fired when refresh is clicked
 */

/**
 * Utility: checks if field type is date-like
 * @param {Field} field
 * @returns {boolean}
 */
const isDateField = (field) =>
  ["DATE", "DATETIME", "TIMESTAMP"].includes(field.type);

/** No-op reusable constants */
const noop = () => {};
const noopArray = () => [];

/**
 * Table sync configuration component
 * @param {TableSyncConfigProps} props
 */
export default function TableSyncConfig({
  loadTableInfo = noopArray,
  onSave = noop,
  onRefresh = noop,
}) {
  const [config, setConfig] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;

  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  // Sorting
  const [orderBy, setOrderBy] = useState("table");
  const [order, setOrder] = useState("asc");

  // Job metadata
  const [jobLabel, setJobLabel] = useState("");
  const [cronExpr, setCronExpr] = useState("");

  useEffect(() => {
    const tables = loadTableInfo();
    setConfig(
      tables.map((t) => ({
        table: t.name,
        fields: t.fields,
        sync: false,
        method: "full_refresh",
        cursor: null,
      }))
    );
  }, [loadTableInfo]);

  const filteredConfig = useMemo(
    () =>
      config.filter((row) =>
        row.table.toLowerCase().includes(search.toLowerCase())
      ),
    [config, search]
  );

  const sortedConfig = useMemo(() => {
    return [...filteredConfig].sort((a, b) => {
      let cmp = 0;
      if (orderBy === "table") {
        cmp = a.table.localeCompare(b.table);
      } else if (orderBy === "method") {
        cmp = a.method.localeCompare(b.method);
      } else if (orderBy === "cursor") {
        cmp = (a.cursor?.name || "").localeCompare(b.cursor?.name || "");
      } else if (orderBy === "sync") {
        cmp = a.sync === b.sync ? 0 : a.sync ? -1 : 1;
      }
      return order === "asc" ? cmp : -cmp;
    });
  }, [filteredConfig, orderBy, order]);

  const pagedConfig = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedConfig.slice(start, start + rowsPerPage);
  }, [sortedConfig, page]);

  const handleToggleSync = (actualIndex) => {
    const updated = [...config];
    updated[actualIndex].sync = !updated[actualIndex].sync;
    setConfig(updated);
  };

  const handleMethodChange = (actualIndex, value) => {
    const updated = [...config];
    updated[actualIndex].method = value;
    setConfig(updated);
  };

  const handleOpenCursorModal = (actualIndex) => {
    setActiveRow(actualIndex);
    setOpen(true);
  };

  const handleCursorSelected = (field) => {
    if (activeRow !== null) {
      const updated = [...config];
      updated[activeRow].cursor = field;
      setConfig(updated);
      setOpen(false);
      setActiveRow(null);
    }
  };

  // Bulk select
  const allSelected = pagedConfig.every((row) => row.sync);
  const someSelected =
    pagedConfig.some((row) => row.sync) && !allSelected;

  const handleBulkToggle = () => {
    const updated = [...config];
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    for (let i = start; i < end && i < sortedConfig.length; i++) {
      const actualIndex = config.findIndex(
        (c) => c.table === sortedConfig[i].table
      );
      if (actualIndex !== -1) {
        updated[actualIndex].sync = !allSelected;
      }
    }
    setConfig(updated);
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleSave = () => {
    onSave({
      label: jobLabel,
      cron: cronExpr,
      tables: config,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Sync Job Configuration
      </Typography>

      {/* Job metadata */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Job Label"
          placeholder="e.g. Nightly Sync"
          value={jobLabel}
          onChange={(e) => setJobLabel(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Cron Expression"
          placeholder="e.g. 0 2 * * *"
          helperText="Define when this sync job should run (standard cron syntax)"
          value={cronExpr}
          onChange={(e) => setCronExpr(e.target.value)}
        />
      </Box>

      {/* Search + Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search tables..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "table" ? order : false}>
                <TableSortLabel
                  active={orderBy === "table"}
                  direction={orderBy === "table" ? order : "asc"}
                  onClick={() => handleSort("table")}
                >
                  Table
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "sync" ? order : false}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleBulkToggle}
                />
                <TableSortLabel
                  active={orderBy === "sync"}
                  direction={orderBy === "sync" ? order : "asc"}
                  onClick={() => handleSort("sync")}
                >
                  Sync?
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "method" ? order : false}>
                <TableSortLabel
                  active={orderBy === "method"}
                  direction={orderBy === "method" ? order : "asc"}
                  onClick={() => handleSort("method")}
                >
                  Method
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "cursor" ? order : false}>
                <TableSortLabel
                  active={orderBy === "cursor"}
                  direction={orderBy === "cursor" ? order : "asc"}
                  onClick={() => handleSort("cursor")}
                >
                  Cursor
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedConfig.map((row) => {
              const actualIndex = config.findIndex(
                (c) => c.table === row.table
              );
              return (
                <TableRow key={row.table}>
                  <TableCell>{row.table}</TableCell>
                  <TableCell>
                    <Switch
                      checked={row.sync}
                      onChange={() => handleToggleSync(actualIndex)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.method}
                      onChange={(e) =>
                        handleMethodChange(actualIndex, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="full_refresh">Full Refresh</MenuItem>
                      <MenuItem value="incremental">Incremental</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {row.method === "incremental" ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenCursorModal(actualIndex)}
                      >
                        {row.cursor
                          ? `${row.cursor.name} (${row.cursor.type})`
                          : "Select Cursor"}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={sortedConfig.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </TableContainer>

      {/* Cursor Selector Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Cursor Field</DialogTitle>
        <DialogContent>
          {activeRow !== null && (
            <CursorSelector
              fields={config[activeRow].fields}
              onSelect={handleCursorSelected}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

/**
 * Cursor Selector widget (only date fields, nicely spaced)
 */
function CursorSelector({ fields, onSelect }) {
  const dateFields = fields.filter(isDateField);

  return (
    <Box sx={{ mt: 2 }}>
      <Autocomplete
        fullWidth
        options={dateFields}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="body1">{option.name}</Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 6, whiteSpace: "nowrap" }}
            >
              {option.type}
            </Typography>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cursor Field"
            placeholder="Search date fields..."
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
        onChange={(_, value) => value && onSelect(value)}
      />
      {dateFields.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ⚠️ No date/datetime fields found in this table.
        </Typography>
      )}
    </Box>
  );
}
