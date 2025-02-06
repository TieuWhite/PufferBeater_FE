import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const styleContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };
  const navigate = useNavigate();

  return (
    <div style={styleContainer}>
      <div style={{ fontSize: "80px" }}>Did you get lost? :0</div>
      <div>
        <h1
          className="wiggle-text hover-cursor"
          style={{ fontSize: "60px", color: "green" }}
          onClick={() => navigate("/")}
        >
          Click me
        </h1>
      </div>
    </div>
  );
}
