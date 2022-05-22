import { createTheme } from "@nextui-org/react";

const sans =
  'Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"';

export const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      backgroundDeep: "#101010",
    },
    fonts: { sans },
    letterSpacings: {
      tighter: "-.049375rem",
    },
  },
});

export const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      gray50: "#EFEFEF",
      backgroundDeep: "#FAFAFF",
      background: "#F9F9F9",
    },
    fonts: { sans },
    letterSpacings: {
      tighter: "-.049375rem",
    },
  },
});
