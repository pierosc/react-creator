import React, { useState, useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";

const CodeEditor = ({
  codeString,
  language = "jsx",
  header = true,
  title = "Example code",
  bgColor = "rgb(40, 44, 52)",
  padding = "25px",
  fontSize = "1em",
  internalMenu = false,
  otherCodeEditorSelected,
  onDelete,
  onClick,
}) => {
  const [copy, setCopy] = useState();
  const [isClicked, setIsClicked] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // console.log(otherCodeEditorSelected);
    if (otherCodeEditorSelected) {
      setIsClicked(false);
    }
  }, [otherCodeEditorSelected]);

  return (
    <div
      className=" min-w-[25rem] rounded-md
      overflow-hidden
      "
      style={{
        backgroundColor: bgColor,
        cursor: typeof onClick === "function" ? "pointer" : "auto",
      }}
      onClick={() => {
        if (typeof onClick === "function") {
          setIsClicked(!isClicked);
          onClick(codeString, !isClicked);
        }

        // console.log("hola");
      }}
      // draggable={true}
    >
      {header && (
        <div className="flex justify-between px-4 text-white text-xs items-center">
          <p className="text-sm">{title}</p>
          {copy ? (
            <button className="py-1 inline-flex items-center gap-1">
              <span className="text-base mt-1">
                <CheckIcon />
              </span>
              Copiado
            </button>
          ) : (
            <button
              className="py-1 inline-flex items-center gap-1"
              onClick={() => {
                navigator.clipboard.writeText(codeString);
                setCopy(true);
                setTimeout(() => {
                  setCopy(false);
                }, 3000);
              }}
            >
              <span className="text-base mt-1">
                <ContentCopyIcon />
              </span>
              Copiar Código
            </button>
          )}
        </div>
      )}
      <div style={{ position: "relative" }}>
        {internalMenu && (
          <div
            className="flex justify-end text-white z-10 "
            style={{ position: "absolute", top: "0", right: "0" }}
          >
            <IconButton>
              <EditIcon sx={{ color: "white" }} fontSize="small" />
            </IconButton>
            {typeof onDelete === "function" && (
              <IconButton
                onClick={(codeString) => {
                  onDelete(codeString);
                }}
              >
                <DeleteIcon sx={{ color: "white" }} fontSize="small" />
              </IconButton>
            )}
            {copy ? (
              <IconButton disabled>
                <CheckIcon sx={{ color: "white" }} fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(codeString);
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 3000);
                }}
              >
                <ContentCopyIcon sx={{ color: "white" }} fontSize="small" />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
            >
              {isCollapsed ? (
                <KeyboardArrowUpIcon sx={{ color: "white" }} fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon
                  sx={{ color: "white" }}
                  fontSize="small"
                />
              )}
            </IconButton>
          </div>
        )}
        <div style={{ border: isClicked ? "2px solid yellow" : "" }}>
          <SyntaxHighlighter
            language={language}
            style={atomOneDark}
            customStyle={{
              padding: padding,
              backgroundColor: bgColor,
              fontSize: fontSize,
            }}
            wrapLongLines={true}
          >
            {isCollapsed ? title : codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
