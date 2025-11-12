import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MemoryIcon from "@mui/icons-material/Memory";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
/* si vas a aumentar alguna ruta, asegura que el route sea igual al name aunque tenga espacios */
export const menuItems = {
  "admin": [
    {
      name: "Gestión de Usuarios",
      Icon: PeopleOutlineIcon,
      route: "/user/gestionDeUsuarios",
      description: "Administra las cuentas y permisos de los usuarios registrados en el sistema.",
    },
    {
      name: "Gestión de Grupos",
      Icon: ArticleIcon,
      route: "/user/gestionDeGrupos",
      description: "Crea, edita y organiza los grupos de usuarios o clases disponibles.",
    },
    {
      name: "Gestión de Profesores",
      Icon: SchoolIcon,
      route: "/user/gestionDeProfesores",
      description: "Controla la información y asignaciones de los profesores registrados.",
    },
    {
      name: "Configuraciones",
      Icon: SettingsIcon,
      route: "/user/configuracion",
      description: "Ajusta las configuraciones generales del sistema y las preferencias del administrador.",
    },
  ],

  "student": [
    {
      name: "Curso",
      Icon: ArticleIcon,
      route: "/user/Curso",
      description: "Accede al contenido del curso, materiales y módulos disponibles.",
    },
    {
      name: "Ejercicios",
      Icon: MemoryIcon,
      route: "/user/Ejercicios",
      description: "Resuelve ejercicios prácticos para reforzar el aprendizaje de los temas vistos.",
    },
    {
      name: "Mi Progreso",
      Icon: AssessmentIcon,
      route: "/user/MiProgreso",
      description: "Consulta tu avance académico, calificaciones y estadísticas personales.",
    },
    {
      name: "Mi Grupo",
      Icon: PeopleOutlineIcon,
      route: "/user/MiGrupo",
      description: "Visualiza los integrantes de tu grupo y colabora con tus compañeros.",
    },
    {
      name: "Notificaciones",
      Icon: NotificationsActiveIcon,
      route: "/user/Notificaciones",
      description: "Revisa los avisos, mensajes y recordatorios importantes del curso.",
    },
  ],

  "teacher": [
    {
      name: "Mis Cursos",
      Icon: ViewInArIcon,
      route: "/user/MisCursos",
      description: "Consulta y gestiona los cursos que impartes dentro de la plataforma.",
    },
    {
      name: "Evaluaciones",
      Icon: ArticleIcon,
      route: "/user/Evaluaciones",
      description: "Crea, edita y califica evaluaciones para los estudiantes de tus cursos.",
    },
    {
      name: "Estudiantes",
      Icon: PeopleOutlineIcon,
      route: "/user/Estudiantes",
      description: "Accede a la lista de estudiantes y monitorea su rendimiento académico.",
    },
    {
      name: "Reportes Grupos",
      Icon: AssessmentIcon,
      route: "/user/ReportesGrupos",
      description: "Genera y consulta reportes detallados sobre los grupos y su desempeño.",
    },
  ],

  "editor": [
    {
      name: "Mis Cursos",
      Icon: ViewInArIcon,
      route: "/user/MisCursos",
      description: "Consulta y gestiona los cursos que impartes dentro de la plataforma.",
    },
    {
      name: "Evaluaciones",
      Icon: ArticleIcon,
      route: "/user/Evaluaciones",
      description: "Crea, edita y califica evaluaciones para los estudiantes de tus cursos.",
    },
    {
      name: "Estudiantes",
      Icon: PeopleOutlineIcon,
      route: "/user/Estudiantes",
      description: "Accede a la lista de estudiantes y monitorea su rendimiento académico.",
    },
    {
      name: "Reportes Grupos",
      Icon: AssessmentIcon,
      route: "/user/ReportesGrupos",
      description: "Genera y consulta reportes detallados sobre los grupos y su desempeño.",
    },
    {
      name: "Gestión de Tópicos",
      Icon: ArticleIcon,
      route: "/user/gestionDeTopicos",
      description: "Administra fácilmente los tópicos y contenidos relacionados con tus cursos.",
    },
  ],
};
