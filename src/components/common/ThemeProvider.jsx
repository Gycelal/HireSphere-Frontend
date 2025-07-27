import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme.theme ?? "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return children;
};

export default ThemeProvider;
