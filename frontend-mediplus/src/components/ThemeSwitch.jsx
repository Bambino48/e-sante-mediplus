// src/components/ThemeSwitch.jsx
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeSwitch() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn-ghost text-lg"
            aria-label="Basculer le thème"
        >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
    );
}
