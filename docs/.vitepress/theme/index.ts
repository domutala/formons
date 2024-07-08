import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import "virtual:uno.css";
import "./styles/main.scss";

const theme: Theme = {
  ...DefaultTheme,
};

export default theme;
