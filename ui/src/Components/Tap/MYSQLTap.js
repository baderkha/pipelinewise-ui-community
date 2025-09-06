import React, { useState } from "react";
import {
  Container,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Box,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel as MuiFormControlLabel,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import CodeIcon from "@mui/icons-material/Code";
import PolylineIcon from "@mui/icons-material/Polyline";
import LanIcon from "@mui/icons-material/Lan";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { SiMysql } from "react-icons/si";
import DnsIcon from "@mui/icons-material/Dns";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/VpnKey";
import ComputerIcon from "@mui/icons-material/Computer";

export default function MYSQLTap() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    host: "",
    port: "3306",
    user: "",
    password: "",
    database: "",
    ssl: false,
    sslCert: null,
    params: [{ key: "", value: "" }],
    sshEnabled: false,
    sshHost: "",
    sshPort: "22",
    sshUser: "",
    sshAuthType: "password", // "password" | "key"
    sshPassword: "",
    sshKey: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleSSL = (e) => {
    setForm((prev) => ({ ...prev, ssl: e.target.checked, sslCert: null }));
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...form.params];
    newParams[index][field] = value;
    setForm((prev) => ({ ...prev, params: newParams }));
  };

  const addParam = () => {
    setForm((prev) => ({
      ...prev,
      params: [...prev.params, { key: "", value: "" }],
    }));
  };

  const removeParam = (index) => {
    const newParams = form.params.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, params: newParams }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted MySQL connection:", form);
    if (form.ssl && form.sslCert) {
      console.log("SSL cert:", form.sslCert.name);
    }
    if (form.sshEnabled && form.sshAuthType === "key" && form.sshKey) {
      console.log("SSH Key:", form.sshKey.name);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <CardContent>
        {/* MySQL Icon + Title */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <SiMysql style={{ fontSize: 96, color: "#00758f" }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Enter your MySQL connection details to continue.
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Basic" icon={<PolylineIcon />} iconPosition="start" />
          <Tab label="Advanced" icon={<CodeIcon />} iconPosition="start" />
        </Tabs>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {tab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Host"
                name="host"
                value={form.host}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                label="Port"
                name="port"
                type="number"
                value={form.port}
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
                label="User"
                name="user"
                value={form.user}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />

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
                      <DnsIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* SSL Section */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  SSL
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.ssl}
                      onChange={handleToggleSSL}
                      color="primary"
                    />
                  }
                  label="Use SSL?"
                />

                {form.ssl && (
                  <>
                    <Button variant="outlined" component="label">
                      Upload SSL Certificate
                      <input
                        type="file"
                        hidden
                        name="sslCert"
                        onChange={handleChange}
                        accept=".pem,.crt,.cer"
                      />
                    </Button>
                    {form.sslCert && (
                      <Typography variant="body2" color="text.secondary">
                        Selected: {form.sslCert.name}
                      </Typography>
                    )}
                  </>
                )}
              </Box>

              {/* Extra Parameters */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Extra Parameters
                </Typography>
                {form.params.map((param, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                  >
                    <TextField
                      label="Key"
                      value={param.key}
                      onChange={(e) =>
                        handleParamChange(index, "key", e.target.value)
                      }
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Value"
                      value={param.value}
                      onChange={(e) =>
                        handleParamChange(index, "value", e.target.value)
                      }
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeParam(index)}
                      disabled={form.params.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addParam}
                  size="small"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add Parameter
                </Button>
              </Box>

              {/* SSH Section */}
              <Box >
                <Typography variant="h6" gutterBottom>
                  SSH Tunnel
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.sshEnabled}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          sshEnabled: e.target.checked,
                        }))
                      }
                      color="primary"
                     
                    />
                  }
                  label="Use SSH?"
                   sx={{
                        paddingBottom:"30px"
                      }}
                />

                {form.sshEnabled && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2,paddingBottom:"30px" }}>
                    <TextField
                      label="SSH Host"
                      name="sshHost"
                      value={form.sshHost}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ComputerIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="SSH Port"
                      name="sshPort"
                      type="number"
                      value={form.sshPort}
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
                      label="SSH User"
                      name="sshUser"
                      value={form.sshUser}
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
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Authentication</FormLabel>
                      <RadioGroup
                        row
                        value={form.sshAuthType}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            sshAuthType: e.target.value,
                            sshPassword: "",
                            sshKey: null,
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

                    {form.sshAuthType === "password" && (
                      <TextField
                        label="SSH Password"
                        name="sshPassword"
                        type="password"
                        value={form.sshPassword}
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

                    {form.sshAuthType === "key" && (
                      <>
                        <Button variant="outlined" component="label">
                          Upload SSH Private Key
                          <input
                            type="file"
                            hidden
                            name="sshKey"
                            onChange={handleChange}
                            accept=".pem,.ppk,.key"
                          />
                        </Button>
                        {form.sshKey && (
                          <Typography variant="body2" color="text.secondary">
                            Selected: {form.sshKey.name}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.2, mt: 3 }}
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Container>
  );
}
