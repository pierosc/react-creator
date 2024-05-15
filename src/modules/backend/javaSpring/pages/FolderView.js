import React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view";
import { TreeItem } from "@mui/x-tree-view";
import EditIcon from "@mui/icons-material/Edit";

function FolderView() {
  const space = "   ";
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="1" label="Business">
          <TreeItem nodeId="2" label="domain" />
          <TreeItem nodeId="3" label="services" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
            <TreeItem
              nodeId="8"
              label="index.js"
              ContentComponent={(props) => <File props={props} />}
            />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Box>
  );
}

export default FolderView;

function File(props) {
  console.log(props);
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div
          className="w-4
"
        ></div>
        <label>{"label"}</label>
      </div>
      <div className="flex gap-1">
        <EditIcon />
        <EditIcon />
      </div>
    </div>
  );
}
