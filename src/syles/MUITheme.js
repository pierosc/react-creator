export const primaryColor = "rgba(32,209,28)"; //GOLDEN
export const primaryColorDisabled = "rgba(32,209,28,0.5)";
export const primaryColorDarker = "rgba(32,209,28)";

export const MUITheme = {
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          color: primaryColorDisabled,
          "&:before": {
            borderTop: `thin solid ${primaryColorDisabled}`,
          },
          "&:after": {
            borderTop: `thin solid ${primaryColorDisabled}`,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: primaryColor,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: "rgba(188,188,188)",
          "&:hover": {
            color: "rgba(111,184,110)",
          },
          "&.Mui-selected": {
            color: primaryColor,
          },
          "&.Mui-disabled": {
            color: "rgba(105,105,105)",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          color: "white",
          //   "&.MuiInputLabel-root": {
          //     color: "green",
          //   },
          "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryColor,
          },
          "&.MuiOutlinedInput-root-MuiSelect-root": {
            color: primaryColor,
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.MuiFormLabel-root": {
            color: primaryColor,
          },
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          "&.MuiSelect-icon": {
            color: primaryColor,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(25,25,25,0.85)",
          color: primaryColor,
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {
        root: {
          // backgroundColor: "rgba(25,25,25,0.85)",
          color: primaryColor,
          "&.MuiMenuItem-root.Mui-selected": {
            "&:hover": {
              backgroundColor: "rgb(45,45,45)",
            },
          },

          "&.MuiMenuItem-root": {
            "&:hover": {
              backgroundColor: "rgb(0,0,0)",
            },
          },

          "&.MuiSwitch-switchBase.Mui-checked": {
            color: primaryColor,
          },
          "&.MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
            backgroundColor: primaryColorDarker,
          },

          //BUTTONS
          "&.MuiButton-root": {
            color: primaryColor,
            border: `1px solid ${primaryColor}`,
            "&:hover": {
              backgroundColor: primaryColor,
              color: "white",
              border: `1px solid ${primaryColor}`,
            },
            "&.Mui-disabled": {
              color: primaryColorDisabled,
              border: `1px solid ${primaryColorDisabled}`,
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        track: {
          backgroundColor: "grey",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "white",
          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: primaryColor,
            },
          "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryColor,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: primaryColor,
          "&:hover": {
            borderColor: primaryColor,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: primaryColor,
        },
      },
    },
  },
};
