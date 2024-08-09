import plugin from "tailwindcss/plugin";
import { PluginAPI } from "tailwindcss/types/config";
import { getInputIcons } from "./input-icon";

export const Utilities = plugin(({ addUtilities }: PluginAPI) => {
  addUtilities({
    ...getInputIcons()
  });
});
