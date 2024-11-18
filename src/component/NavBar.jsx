import Box from "@mui/material/Box";

export default function NavBar() {
  const navBarStyles = {
    display: "flex",
    justifyContent: "center",
    fontSize: "2rem",
    backgroundColor: "grey",
    padding: "30px",
    opacity: 0.6,
  };

  return (
    <>
      <Box sx={navBarStyles}>Puffer Typer</Box>
    </>
  );
}
