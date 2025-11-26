export const getRoleDisplay = (roleName) => {
  switch (roleName) {
  case "admin":
    return "Administrador";
  case "teacher":
    return "Profesor";
  case "editor":
    return "Editor";
  case "student":
    return "Estudiante";
  default:
    return roleName;
  }
};

export const getRoleColor = (roleName) => {
  switch (roleName) {
  case "admin":
    return "error";
  case "teacher":
    return "info";
  case "editor":
    return "warning";
  case "student":
    return "success";
  default:
    return "default";
  }
};
