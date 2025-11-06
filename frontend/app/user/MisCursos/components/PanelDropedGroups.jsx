import React, { useState, useMemo } from "react";
import { IconButton,Box, ListItem, Typography, Paper, Tooltip, List, Checkbox, Link } from "@mui/material";
import { TableRow, Table, TableContainer, TableCell, TableHead, TableBody } from "@mui/material";
import ButtonCustom from "@/app/components/Button";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import RestoreIcon from "@mui/icons-material/Restore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditGroupModal from "./EditGroupModal";
import DeleteGroupModal from "./DeleteGroupModal";
import { Delete } from "@mui/icons-material";
import HeaderTableTitle from "./HeaderTableTitle";
import { URL_API_ROOT } from "@/app/redirections";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useSessionZ } from "@/app/context/SessionContext";
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

const PanelDropedGroups = ({ groups, valueTab, updated, setUpdated, fetch }) => {
  const { id } = useSessionZ((state) => state.user);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortBy, setSortBy] = useState({ asc:true, ordered:"stillValid" });
  const [currentUser, setCurrentUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const filteredUsers = useMemo(() => {
    let filtered = [...groups];
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
  }, [groups, sortBy]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers( filteredUsers );
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

  const handleEdit = async(user) => {

    const url = `${URL_API_ROOT}/api/group/restore/${ user.id }`;
    try {
      await axios.get(url, { withCredentials:true });
      fetch();
      enqueueSnackbar("Restaurado con exito", { variant:"success" });
    } catch {
      enqueueSnackbar("Error interno del servidor",{ variant:"error" });
    }
  };

  const handleRestoreAll = async(data)=>{
    try {
      for (const group of data) {
        const url = `${URL_API_ROOT}/api/group/restore/${group.id}`;
        await axios.get(url, { withCredentials: true });
      }
      await setSelectedUsers([]);
      fetch();
      enqueueSnackbar("Restaurado todos los grupos con exito!", { variant:"success" });
    } catch {
      enqueueSnackbar("No se puede comunicar con el servidor", { variant:"error" });
    }
  };

  const handleDeleteSingle = (user) => {
    setUsersToDelete([user]);
    setDeleteModalOpen(true);
  };

  const handleDeleteSelected = () => {

    setUsersToDelete(selectedUsers);
    setDeleteModalOpen(true);
  };

  const handleDeleteAll = () => {
    setUsersToDelete(groups);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async(password) => {
    setIsDeleting(true);
    let message = "";
    let variant = "success";
    try {
      for (const group of usersToDelete){
        const payload = { id: group.id, userId: id, password };
        const url = `${URL_API_ROOT}/api/group/delete`;

        const response = await axios.post(url,payload, {
          withCredentials: true,
        });

        message = response.data.message;
        variant = response.data.success ? "success" : "error";
      }
    } catch {
      enqueueSnackbar("error del servidor", { variant:"error" });
    }
    enqueueSnackbar(message, { variant });
    fetch();
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setSelectedUsers([]);
  };

  const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length;
  return (<Box mt={3} display={ valueTab !== 1 && "none" }>
    <HeaderTableTitle title="Grupos Archivados" Icon = { AutoDeleteIcon }>
      <List
        sx={{
          color:"background.contrastText",
        }}>
        <ListItem>
        Revisa todos los grupos Archivados hasta el momento.
        </ListItem>
      </List>
    </HeaderTableTitle>
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Lista de Grupos
      </Typography>
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
            {selectedUsers.length} grupos(s) seleccionado(s)
          </Typography>
          <Box>
            <Tooltip title="Restaurar Seleccionados">
              <IconButton color="primary" onClick={ () => {
                handleRestoreAll(selectedUsers);
              }}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar Seleccionados">
              <IconButton color="error" onClick={handleDeleteSelected}>
                <AutoDeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
              <TableCell>Archivado en<OrderIcon name="code" sortBy={ sortBy } setSortBy={ setSortBy } /></TableCell>

              <TableCell>Acciones</TableCell>
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
                selected={selectedUsers.some((item) => item.id===group.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.some((item) =>item.id === group.id)}
                    onChange={() => handleSelectUser(group)}
                    sx={{ color: "background.contrastText", "&.Mui-checked": { color: "primary.main" } }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        <Link href={ `/user/MisCursos/${ group.id }` }>{group.title}</Link>
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(group.droppedDate).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Tooltip title="Restaurar Seleccionados">
                    <IconButton color="primary" onClick={() => handleEdit(group) }>
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Seleccionados">
                    <IconButton color="error" onClick={ () => handleDeleteSingle(group) }>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell align="center" colSpan={6}> <Typography>Vacío</Typography> </TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

    <EditGroupModal
      open={editModalOpen}
      onClose={() => setEditModalOpen(false)}
      group={ currentUser }
      loading={isUpdating}
      setUpdated = { setUpdated }
      updated={updated}
    />

    <DeleteGroupModal
      open={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      users={usersToDelete}
      onConfirm={handleConfirmDelete}
      loading={isDeleting}
    />
    <Box display="flex" mt={3} gap={2}>
      <ButtonCustom type="primary" onClick = { () => handleRestoreAll(groups) }>
        <RestoreIcon />
        Restaurar Todo
      </ButtonCustom>
      <ButtonCustom
        onClick = { handleDeleteAll }
      >
        <AutoDeleteIcon />
        Eliminar Todo
      </ButtonCustom>
    </Box>
  </Box>);
};

export default PanelDropedGroups;

