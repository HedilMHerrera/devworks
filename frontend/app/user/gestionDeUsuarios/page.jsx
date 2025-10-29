"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Menu,
  Avatar,
  Chip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import EditUserModal from "./components/EditUserModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { getRoleDisplay, getRoleColor } from "./utils/roleUtils";
import { useSessionZ } from "../../context/SessionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:30001";

const UserManagementPage = () => {
  const sessionUser = useSessionZ((s) => s.user);
  const sessionRol = useSessionZ((s) => s.rol);
  const roleNameRaw = (typeof (sessionUser?.role) === "string"
    ? sessionUser.role
    : (sessionRol?.name || sessionRol));
  const roleName = (roleNameRaw || "").toString().toLowerCase();
  const isAdmin = roleName === "admin";
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = async() => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        enqueueSnackbar("Error al cargar usuarios", { variant: "error" });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching users:", error);
      enqueueSnackbar("Error de conexión", { variant: "error" });
    }
  };

  useEffect(() => {
    const loadData = async() => {
      setLoading(true);

      if (!isAdmin) {
        setLoading(false);
        return;
      }

      await fetchUsers();

      try {
        const response = await fetch(`${API_URL}/api/admin/roles`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setRoles(data.roles);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching roles:", error);
      }

      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleLabelMap = useMemo(() => ({
    admin: "Administrador",
    teacher: "Profesores",
    student: "Estudiantes",
  }), []);

  const roleOptions = useMemo(() => {
    if (roles && roles.length > 0) {
      return roles.map((r) => ({
        id: r.id,
        name: r.name,
        label: roleLabelMap[r.name] || r.name,
      }));
    }

    if (users && users.length > 0) {
      const uniqueRoles = Array.from(new Set(users.map((u) => u.role).filter(Boolean)));
      if (uniqueRoles.length > 0) {
        return uniqueRoles.map((role) => ({
          id: role.id,
          name: role.name,
          label: roleLabelMap[role.name] || role.name,
        }));
      }
    }

    return [
      { id: 1, name: "student", label: "Estudiantes" },
      { id: 2, name: "teacher", label: "Profesores" },
      { id: 3, name: "admin", label: "Administrador" },
    ];
  }, [roles, users, roleLabelMap]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        const fullName = `${user.name} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(term) || email.includes(term);
      });
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role.name === roleFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "lastName") {
        return a.lastName.localeCompare(b.lastName);
      }
      return 0;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, sortBy]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteSingle = (user) => {
    setUsersToDelete([user]);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleSendEmail = (user) => {
    const recipients = user ? [user.email] : users.filter((u) => selectedUsers.includes(u.id)).map((u) => u.email);

    if (recipients.length === 0) {
      enqueueSnackbar("No hay destinatarios seleccionados", { variant: "warning" });
      return;
    }

    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&bcc=${encodeURIComponent(recipients.join(","))}&tf=cm&hl=es`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");

    handleMenuClose();
    handleActionsMenuClose();
  };

  const handleActionsMenuOpen = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setActionsAnchorEl(null);
  };

  const handleEditSelected = () => {
    if (selectedUsers.length === 1) {
      const user = users.find((u) => u.id === selectedUsers[0]);
      handleEdit(user);
    }
    handleActionsMenuClose();
  };

  const handleDeleteSelected = () => {
    const usersData = users.filter((u) => selectedUsers.includes(u.id));
    setUsersToDelete(usersData);
    setDeleteModalOpen(true);
    handleActionsMenuClose();
  };

  const handleUpdateUser = async(userId, roleId) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roleId }),
      });

      const data = await response.json();

      if (data.success) {
        enqueueSnackbar("Usuario actualizado exitosamente", { variant: "success" });
        fetchUsers();
        setEditModalOpen(false);
      } else {
        enqueueSnackbar(data.message || "Error al actualizar", { variant: "error" });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating user:", error);
      enqueueSnackbar("Error de conexión", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async() => {
    try {
      setIsDeleting(true);
      const ids = usersToDelete.map((u) => u.id);
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();

      if (data.success) {
        enqueueSnackbar(data.message, { variant: "success" });
        setSelectedUsers([]);
        fetchUsers();
        setDeleteModalOpen(false);
      } else {
        enqueueSnackbar(data.message || "Error al eliminar", { variant: "error" });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting users:", error);
      enqueueSnackbar("Error de conexión", { variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length;

  if (!roleName && loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          No autorizado
        </Typography>
        <Typography variant="body1" sx={{ color: "background.contrastText" }}>
          No tienes permisos para acceder a la gestión de usuarios.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" sx={{ color: "background.contrastText", mt: 0.5 }}>
            Administra las cuentas y permisos de los usuarios registrados en el sistema.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { backgroundColor: "primary.main" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Agregar Usuario
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Lista de Usuarios
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "background.contrastText" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiInputBase-root": { backgroundColor: "secondary.main", color: "secondary.contrastText" },
              "& .MuiInputLabel-root": { color: "background.contrastText" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "secondary.main" },
            }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 200, "& .MuiInputBase-root": { backgroundColor: "secondary.main" } }}>
            <Select
              value={roleFilter}
              displayEmpty
              onChange={(e) => setRoleFilter(e.target.value)}
              renderValue={(selected) => selected ? (roleLabelMap[selected] || selected) : "Todos los Roles"}
              sx={{ color: "secondary.contrastText", "& .MuiSelect-icon": { color: "secondary.contrastText" } }}
            >
              <MenuItem value="">Todos los Roles</MenuItem>
              {roleOptions.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {selectedUsers.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              p: 2,
              backgroundColor: "secondary.main",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {selectedUsers.length} usuario(s) seleccionado(s)
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleActionsMenuOpen}
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.main" },
                textTransform: "none",
              }}
            >
              Acciones
            </Button>
            <Menu
              anchorEl={actionsAnchorEl}
              open={Boolean(actionsAnchorEl)}
              onClose={handleActionsMenuClose}
            >
              <MenuItem
                onClick={handleEditSelected}
                disabled={selectedUsers.length !== 1}
              >
                <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
              </MenuItem>
              <MenuItem onClick={() => handleSendEmail(null)}>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Enviar correos
              </MenuItem>
              <MenuItem onClick={handleDeleteSelected}>
                <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                <Typography color="error">Eliminar Selección</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  color: "background.contrastText",
                  borderBottom: "0.5px solid",
                  borderColor: "background.contrastText",
                },
                "& .MuiTableCell-head": {
                  borderBottom: "0.5px solid",
                  borderColor: "background.contrastText",
                },
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    sx={{ color: "background.contrastText", "&.Mui-checked": { color: "primary.main" } }}
                  />
                </TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>ROL</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ORDENAR
                    </Typography>
                    <KeyboardArrowDownIcon fontSize="small" sx={{ color: "background.contrastText" }} />
                  </Box>
                  <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={() => setSortAnchorEl(null)}
                  >
                    <MenuItem onClick={() => { setSortBy("name"); setSortAnchorEl(null); }}>Por Nombre</MenuItem>
                    <MenuItem onClick={() => { setSortBy("lastName"); setSortAnchorEl(null); }}>Por Apellido</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& .MuiTableCell-root": {
                  borderBottom: "0.5px solid",
                  borderColor: "background.contrastText",
                },
              }}
            >
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  selected={selectedUsers.includes(user.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      sx={{ color: "background.contrastText", "&.Mui-checked": { color: "primary.main" } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={`https://ui-avatars.com/api/?name=${user.name}+${user.lastName}&background=random`}
                        alt={`${user.name} ${user.lastName}`}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.name} {user.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "background.contrastText" }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleDisplay(user.role.name)}
                      color={getRoleColor(user.role.name)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)} sx={{ color: "background.contrastText" }}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(currentUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => handleSendEmail(currentUser)}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} /> Enviar correo
        </MenuItem>
        <MenuItem onClick={() => handleDeleteSingle(currentUser)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
          <Typography color="error">Eliminar</Typography>
        </MenuItem>
      </Menu>

      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={currentUser}
        roles={roles}
        onUpdate={handleUpdateUser}
        loading={isUpdating}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        users={usersToDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </Container>
  );
};

export default UserManagementPage;
