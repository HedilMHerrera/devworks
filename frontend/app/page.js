"use client";
//import Image from "next/image";
//import SvgIcon from "@mui/material";
import { Paper, Container, Typography, Box } from "@mui/material";
import ButtonCustom from "./components/Button";
import SnakeIcon from "./snakeicon/SnakeIcon";
export default function Home() {
  return (
    <div>
      <Paper
        square
        sx={{
          position: "relative",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          boxSizing: "border-box",
          bgcolor: "#071026",
          color: "common.white",
          py: { xs: 8, md: 10 },
          boxShadow: "none",
          border: "none",
        }}
      >

        <Box
          component="div"
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            width: "100vw",
            height: "100%",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100vw", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <Box
            component="div"
            sx={{ position: "absolute", inset: 0, bgcolor: "rgba(7,16,38,0.45)", zIndex: 1 }}
          />

          <Box
            component="div"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: { xs: "45%", md: "35%" },
              background: "linear-gradient(to top, #040d24ff 0%, rgba(3, 13, 39, 0) 100%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              position: "relative",
            }}
          >

            <Box sx={{ width: { xs: "100%", md: "85%" }, ml: { md: 0 }, mr: { md: 0 } }}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
                  lineHeight: 1.03,
                  mb: 4,
                }}
              >
                PyCraft: La plataforma definitiva para aprender y enseñar de forma interactiva.
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "background.contrastText", maxWidth: 680, mb: 4 }}
              >
                Crea cursos, asigna ejercicios, monitorea el progreso de tus
                estudiantes y lleva tus clases al siguiente nivel. Si eres
                estudiante, únte a un curso y demuestra tus habilidades.
              </Typography>

              <ButtonCustom
                type="primary"
                href="#"
                sx={{
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontWeight: 700,
                  minWidth: "auto",
                  width: "fit-content",
                  "&:hover": { backgroundColor: "#9cff00", transform: "translateY(-2px)" },
                }}
              >
                Empieza Ahora ⟶
              </ButtonCustom>
            </Box>

            <Box
              aria-hidden
              sx={{
                display: { xs: "none", md: "block" },
                width: 420,
                height: 420,
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 20%, rgba(21,142,86,0.12), rgba(6,16,30,0.0) 60%)",
                position: "absolute",
                right: -120,
                top: -40,
                filter: "blur(24px)",
                zIndex: 0,
              }}
            />
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: { xs: 6, md: 5 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography component="h2" variant="h4" sx={{ fontWeight: 800 }}>
            Para Profesores
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
            width: "100%",
            mx: "auto",
            justifyItems: "stretch",
          }}
        >
          {[
            {
              title: "Gestión\nde Cursos",
              desc: "Crea y administra tus cursos, asigna estudiantes y organiza el contenido fácilmente.",
            },
            {
              title: "Evaluaciones\nPersonalizadas",
              desc: "Diseña, asigna y califica evaluaciones para medir el conocimiento de tus estudiantes.",
            },
            {
              title: "Reportes\nde Desempeño",
              desc: "Genera reportes detallados del progreso de tus grupos y estudiantes.",
            },
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: "#141d2b",
                color: "background.contrastText",
                border: "1px solid rgba(255,255,255,0.03)",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >

              {(item.title === "Gestión\nde Cursos" || item.title === "Evaluaciones\nPersonalizadas" || item.title === "Reportes\nde Desempeño") && (
                <Box
                  component="img"
                  src={
                    item.title === "Gestión\nde Cursos"
                      ? "/gestionC.png"
                      : item.title === "Evaluaciones\nPersonalizadas"
                        ? "/evaluacionP.png"
                        : "/reportesD.png"
                  }
                  alt={item.title}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: -5,
                    width: { xs: 0, sm: 120, md: 170 },
                    height: { xs: 0, sm: 84, md: 130 },
                    objectFit: "contain",
                    pointerEvents: "none",
                    display: { xs: "none", sm: "block" },
                    zIndex: 0,
                    opacity: 0.7,
                  }}
                />
              )}

              <Box sx={{ position: "relative", zIndex: 1, mt:6 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, whiteSpace: "pre-line", color: "common.white" }}>
                  {item.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
                  {item.desc}
                </Typography>
              </Box>

            </Box>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: { xs: 6, md: 5 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography component="h2" variant="h4" sx={{ fontWeight: 800 }}>
            Para Estudiantes
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
            width: "100%",
            mx: "auto",
            justifyItems: "stretch",
          }}
        >
          {[
            {
              title: "Cursos\nInteractivos",
              desc: "Accede a materiales, módulos y contenido del curso de forma organizada.",
            },
            {
              title: "Ejercicios\nPrácticos",
              desc: "Pon a prueba tus conocimientos con ejercicios diseñados para reforzar tu aprendizaje.",
            },
            {
              title: "Sigue\ntu Progreso",
              desc: "Visualiza tus calificaciones y avance en tiempo real para mantenerte motivado.",
            },
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: "#141d2b",
                color: "background.contrastText",
                border: "1px solid rgba(255,255,255,0.03)",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {(item.title === "Cursos\nInteractivos" || item.title === "Ejercicios\nPrácticos" || item.title === "Sigue\ntu Progreso") && (
                <Box
                  component="img"
                  src={
                    item.title === "Cursos\nInteractivos"
                      ? "/cursosI.png"
                      : item.title === "Ejercicios\nPrácticos"
                        ? "/ejersiciosP.png"
                        : "/sigueP.png"
                  }
                  alt={item.title}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: -5,
                    width: { xs: 0, sm: 120, md: 170 },
                    height: { xs: 0, sm: 84, md: 130 },
                    objectFit: "contain",
                    pointerEvents: "none",
                    display: { xs: "none", sm: "block" },
                    zIndex: 0,
                    opacity: 0.7,
                  }}
                />
              )}

              <Box sx={{ position: "relative", zIndex: 1, mt:6 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, whiteSpace: "pre-line", color: "common.white" }}>
                  {item.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
                  {item.desc}
                </Typography>
              </Box>

            </Box>
          ))}
        </Box>
      </Container>

      <Box
        sx={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          boxSizing: "border-box",
          bgcolor: "#071026",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 4,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {[
              { value: "2.4M+", label: "MIEMBROS" },
              { value: "480+", label: "LABORATORIOS" },
              { value: "1.5K+", label: "ORGANIZACIONES" },
              { value: "300+", label: "UNIVERSIDADES" },
            ].map((s, i) => (
              <Box key={i}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#8ff300",
                    fontWeight: 800,
                    fontSize: { xs: "1.6rem", md: "2.4rem" },
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </Typography>

                <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5, fontSize: 12, letterSpacing: 1 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography component="h2" variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            ¿Listo para empezar?
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4 }}>
            Forma parte de una comunidad global donde puedes aprender, codificar y hacer
            crecer tus habilidades.
          </Typography>

          <ButtonCustom
            type="primary"
            href="#"
            sx={{
              backgroundColor: "#8ff300",
              color: "rgba(0,18,23,0.95)",
              fontWeight: 700,
              width: "fit-content",
              minWidth: "auto",
              px: 3,
              py: 1,
              mx: "auto",
              display: "inline-flex",
              borderRadius: 1,
              boxShadow: "0 16px 32px rgba(143,243,0,0.12)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
              "&:hover": { backgroundColor: "#9cff00", transform: "translateY(-2px)" },
            }}
          >
            Crear mi Cuenta Ahora
          </ButtonCustom>
        </Box>
      </Container>

      <Box>
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <Box sx={{ bgcolor: "#141d2b", color: "background.contrastText", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 2, p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr repeat(2, 1fr)" }, gap: 4 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>

                  <SnakeIcon width={32} height={24} />
                  <Typography sx={{ fontWeight: 800 }}>Pycraft</Typography>
                </Box>

                <Typography sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 420, mb: 2 }}>
                  La experiencia completa para enseñar y aprender python.
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 1 }}>Recursos</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {["Blog","Laboratorios"].map((t)=> (
                    <Typography key={t} component="a" href="#" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>{t}</Typography>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 1 }}>Plataforma</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {["Sobre nosotros","Contactanos"].map((t)=> (
                    <Typography key={t} component="a" href="#" sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textDecoration: "none" }}>{t}</Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["f","ig","x","in"].map((i, idx) => (
                <Box key={idx} component="a" href="#" sx={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: 18 }}>{i}</Box>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
              <Typography component="a" href="#" sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>Política de Privacidad</Typography>
              <Typography component="a" href="#" sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none" }}>Acuerdo de Usuario</Typography>
            </Box>

            <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>© 2025 Pycraft</Typography>
          </Box>
        </Container>
      </Box>

    </div>
  );
}
