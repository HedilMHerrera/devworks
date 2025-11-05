export const getRoleDisplay = (roleName) => {
  switch (roleName) {
  case "admin":
    return "Administrador";
  case "teacher":
    return "Profesor";
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
  case "student":
    return "success";
  default:
    return "default";
  }
};
