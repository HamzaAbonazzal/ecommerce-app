import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return <div style={{ width: 42, height: 42 }} />;

  return (
    <button
      type="button"
      className="glass-btn"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "light" ? "Dark mode" : "Light mode"}
    >
      <i
        className={`bi ${
          theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
        }`}
      ></i>
    </button>
  );
}
