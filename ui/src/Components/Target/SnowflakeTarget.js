import React, { useState } from "react";
import {
  Container,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel as MuiFormControlLabel,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import DnsIcon from "@mui/icons-material/Dns";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SiSnowflake } from "react-icons/si";

export default function SnowflakeTarget() {
  const [form, setForm] = useState({
    accountUrl: "",
    account: "",
    authType: "password", // "password" | "key"
    password: "",
    privateKey: null,
    role: "",
    warehouse: "",
    database: "",
    schema: "",
    stage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStageBlur = () => {
    if (form.stage && !form.stage.startsWith("@")) {
      setForm((prev) => ({ ...prev, stage: `@${prev.stage}` }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Snowflake Target:", form);
    if (form.authType === "key" && form.privateKey) {
      console.log("Private Key:", form.privateKey.name);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <CardContent>
        {/* Snowflake Logo + Title */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <SiSnowflake style={{ fontSize: 96, color: "#29B5E8" }} />
          <Typography
            variant="h5"
            align="center"
            sx={{ mt: 1, fontWeight: "bold", color: "#29B5E8" }}
          >
            Snowflake
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Enter your Snowflake connection details to continue.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Account URL"
              name="accountUrl"
              value={form.accountUrl}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SiSnowflake style={{ color: "#29B5E8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              label="Account"
              name="account"
              value={form.account}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Auth Type */}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Authentication</FormLabel>
              <RadioGroup
                row
                value={form.authType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    authType: e.target.value,
                    password: "",
                    privateKey: null,
                  }))
                }
              >
                <MuiFormControlLabel
                  value="password"
                  control={<Radio />}
                  label="Password"
                />
                <MuiFormControlLabel
                  value="key"
                  control={<Radio />}
                  label="Private Key"
                />
              </RadioGroup>
            </FormControl>

            {form.authType === "password" && (
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {form.authType === "key" && (
              <>
                <Button variant="outlined" component="label">
                  Upload Private Key
                  <input
                    type="file"
                    hidden
                    name="privateKey"
                    onChange={handleChange}
                    accept=".pem,.ppk,.key"
                  />
                </Button>
                {form.privateKey && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {form.privateKey.name}
                  </Typography>
                )}
              </>
            )}

            <TextField
              required
              fullWidth
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SecurityIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              label="Warehouse"
              name="warehouse"
              value={form.warehouse}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StorageIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              label="Database"
              name="database"
              value={form.database}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StorageIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              label="Schema"
              name="schema"
              value={form.schema}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DnsIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              label="Stage (S3)"
              name="stage"
              value={form.stage}
              onChange={handleChange}
              onBlur={handleStageBlur}
              helperText="Stage name should start with '@' (auto-prefixed if omitted)."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CloudUploadIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.2, mt: 3 }}
            >
              Save
            </Button>
          </Box>
        </form>
      </CardContent>
    </Container>
  );
}
