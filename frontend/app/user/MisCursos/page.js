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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Menu,
  Chip,
  InputAdornment,
  CircularProgress,
  ListItemButton,
  Tooltip,
  Tab,
  Tabs,
  Link,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Groups,
  Group,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import EditGroupModal from "./components/EditGroupModal";
import ArchiveGroupModal from "./components/ArchiveGroupModal";
import { useSessionZ } from "../../context/SessionContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { URL_API_ROOT } from "@/app/redirections";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PanelDropedGroups from "./components/PanelDropedGroups";
import HeaderTableTitle from "./components/HeaderTableTitle";
import ButtonCustom from "@/app/components/Button";
import ArchiveIcon from "@mui/icons-material/Archive";
const OrderIcon = ({ sortBy, setSortBy, name }) => {
  const handleClick = () => {
    const asc = (sortBy.ordered === name) ? !sortBy.asc: true;
    setSortBy({ ordered:name, asc });
  };

  return <IconButton
    onClick={ handleClick }
  >
    {(name === sortBy.ordered && sortBy.asc) ? <ExpandLessIcon color="primary"/>:<ExpandMoreIcon color="primary"/>}
  </IconButton>;
};

const UserManagementPage = () => {
  const router = useRouter();
  const sessionUser = useSessionZ((s) => s.user);
  const sessionRol = useSessionZ((s) => s.rol);
  const roleNameRaw = (typeof (sessionUser?.role) === "string"
    ? sessionUser.role
    : (sessionRol?.name || sessionRol));
  const roleName = (roleNameRaw || "").toString().toLowerCase();
  const isAdmin = roleName === "teacher";
  const [groups, setGroups] = useState([]);
  const [droppedGroups, setDroppedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Activos");
  const [sortBy, setSortBy] = useState({ asc:true, ordered:"stillValid" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [valueTab, setValueTab] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const fetchGroups = async() => {
    try {
      const urlApiRoot = URL_API_ROOT;
      const urlApi = `${ urlApiRoot }/api/groups/teacher`;
      const dataGroups = await axios.get(urlApi,{ withCredentials:true });
      const droppedG = dataGroups.data.groups.filter((item) => item.dropped);
      const notDroppedG = dataGroups.data.groups.filter((item) => !item.dropped);
      setDroppedGroups(droppedG);
      setGroups(notDroppedG);
    } catch (e){
      enqueueSnackbar(`Error del servidor : ${ e }`,{ variant:"error" });
    }
  };

  useEffect(() => {
    const loadData = async() => {
      setLoading(true);

      if (!isAdmin) {
        setLoading(false);
        return;
      }

      await fetchGroups();

      setLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  const filteredUsers = useMemo(() => {
    let filtered = [...groups];
    if (roleFilter === "Activos"){
      filtered = filtered.filter((group) => group.stillValid);
    }
    if (roleFilter === "Vencidos"){
      filtered = filtered.filter((group) => !group.stillValid);
    }
    if (searchTerm.trim().length > 0){
      filtered = filtered.filter((group) =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    }
    if (filtered.length > 0){
      filtered = filtered.sort((a, b) => {
        const valA = String(a[sortBy.ordered]);
        const valB = String(b[sortBy.ordered]);

        return sortBy.asc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
    return filtered;
  }, [groups, searchTerm, roleFilter, sortBy]);

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

  const handleActionsMenuClose = () => {
    setActionsAnchorEl(null);
  };

  const handleDeleteSelected = () => {
    const usersData = groups.filter((u) => selectedUsers.includes(u.id));
    setUsersToDelete(usersData);
    setDeleteModalOpen(true);
    handleActionsMenuClose();
  };

  const handleConfirmDelete = async() => {
    setIsDeleting(true);
    for (const group of usersToDelete) {
      const url = `${URL_API_ROOT}/api/group/drop/${group.id}`;
      await axios.get(url, { withCredentials: true });
    }
    await setIsDeleting(false);
    await setDeleteModalOpen(false);
    await setSelectedUsers([]);
    await fetchGroups();
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
          No tienes permisos para acceder a esta página.
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
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Tabs
        value={valueTab}
        onChange={(event, newOption) => setValueTab(newOption)}
        aria-label="basic tabs example"
        sx={{
          "& :not(.Mui-selected)":{
            color:"background.contrastText",
          },
        }}
      >
        <Tab label="Grupos" icon={ <Group /> } iconPosition="start"/>
        <Tab label="Archivados" icon={ <ArchiveIcon />} iconPosition="start"/>
      </Tabs>
      <Box mt={3} display={ valueTab!==0 && "none" }>
        <HeaderTableTitle title="Mis Cursos" Icon={ Groups }>
          <Box>
            Consulta y gestiona los cursos que impartes dentro de la plataforma.
          </Box>
        </HeaderTableTitle>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Lista de Grupos
            </Typography>
            <ButtonCustom
              type="primary"
              onClick={ () => router.push("/user/MisCursos/nuevo")}
            >
              <AddIcon />
              Crear Grupo
            </ButtonCustom>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              placeholder="Buscar por título"
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
                renderValue={(selected) => selected }
                sx={{ color: "secondary.contrastText", "& .MuiSelect-icon": { color: "secondary.contrastText" } }}
              >
                <MenuItem value="Todos">
                  Todos
                </MenuItem>
                <MenuItem value="Activos">
                  Activos
                </MenuItem>
                <MenuItem value="Vencidos">
                  Vencidos
                </MenuItem>
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
                {selectedUsers.length} grupo(s) seleccionado(s)
              </Typography>
              <IconButton onClick={handleDeleteSelected}>
                <Tooltip title="Archivar Seleccionados">
                  <ArchiveIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
                </Tooltip>
              </IconButton>
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
                  <TableCell>Titulo<OrderIcon name="title" sortBy={ sortBy } setSortBy={ setSortBy } /></TableCell>
                  <TableCell>Código<OrderIcon name="code" sortBy={ sortBy } setSortBy={ setSortBy } /></TableCell>
                  <TableCell>Estado<OrderIcon name="stillValid" sortBy={ sortBy } setSortBy={ setSortBy } /></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
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
                {filteredUsers.length > 0 ? filteredUsers.map((group) => (
                  <TableRow
                    key={group.id}
                    hover
                    selected={selectedUsers.includes(group.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(group.id)}
                        onChange={() => handleSelectUser(group.id)}
                        sx={{ color: "background.contrastText", "&.Mui-checked": { color: "primary.main" } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            <Link
                              href={ `/user/MisCursos/${ group.id }` }>
                              {group.title}
                            </Link>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Tooltip title={ "copiar" }>
                          <ListItemButton
                            onClick={ async() => await navigator.clipboard.writeText(group.code) }
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {group.code}
                            </Typography>
                          </ListItemButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box>
                          { (group.stillValid) ? <Chip
                            variant="outlined"
                            label="Vigente"
                            color="primary"
                            size="small"
                          />:<Chip
                            label="Vencido"
                            color="background"
                            size="small"
                          /> }
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      { (group.running) &&  <Chip
                        label="Activo"
                        color="success"
                        size="small"
                      />}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, group)} sx={{ color: "background.contrastText" }}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : <TableRow><TableCell align="center" colSpan={6}> <Typography>Vacío</Typography> </TableCell></TableRow> }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleEdit(currentUser)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => handleDeleteSingle(currentUser)}>
            <ArchiveIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
            <Typography color="error">Archivar</Typography>
          </MenuItem>
        </Menu>

        <EditGroupModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          group={ currentUser }
          loading={isUpdating}
          setUpdated = { setUpdated }
          updated={updated}
        />

        <ArchiveGroupModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          users={usersToDelete}
          onConfirm={handleConfirmDelete}
          loading={isDeleting}
        />
      </Box>
      <PanelDropedGroups groups={ droppedGroups } valueTab={ valueTab } fetch = { fetchGroups } updated = { updated } setUpdated = { setUpdated }/>
    </Container>
  );
};

export default UserManagementPage;

