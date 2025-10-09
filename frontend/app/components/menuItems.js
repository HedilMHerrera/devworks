import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
export const menuItems = {
    'admin':[
        {
            name:'Usuarios',
            Icon:PeopleOutlineIcon,
            route:'/gestionDeUsuarios',
        },{
            name:'Grupos',
            Icon:ArticleIcon,
            route:'/gestionDeGrupos',
        },{
            name:'Profesores',
            Icon:SchoolIcon,
            route:'/gestionDeProfesores',
        },{
            name:'Configuraciones',
            Icon:SettingsIcon,
            route:'/configuracion',
        },
    ],
    'student':[{
            name:'Curso',
            Icon:AssessmentIcon,
            route:'/contenidoCurso',
        },{
            name:'Ejercicios',
            Icon:MemoryIcon,
            route:'/ejerciciosPracticos',
        },{
            name:'Mi Progreso',
            Icon:AssessmentIcon,
            route:'/miProgreso',
        },{
            name:'Mi Grupo',
            Icon:PeopleOutlineIcon,
            route:'/miGrupo',
        },{
            name:'Notificaciones',
            Icon:NotificationsActiveIcon,
            route:'/notificaciones',
        },

    ],
    'teacher':[
        {
            name:'Mis Cursos',
            Icon:ViewInArIcon,
            route:'/Cursos',
        },
        {
            name:'Evaluaciones',
            Icon:ArticleIcon,
            route:'/evaluaciones',
        },
        {
            name:'Estudiantes',
            Icon:PeopleOutlineIcon,
            route:'/estudiantes',
        },
        {
            name:'Reportes Generales',
            Icon:AssessmentIcon,
            route:'/reportesGrupos',
        },
    ],
}
