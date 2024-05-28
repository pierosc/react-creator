import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import { boxStyle } from "../../syles/BoxStyle";

function Installation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="grid items-start">
        <Button
          size="large"
          onClick={() => {
            setOpen(true);
          }}
        >
          Installation Tip
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={boxStyle}>
          <div className="grid  p-4 gap-4">
            <label className="text-white">FOR WINDOWS</label>
            <label className="text-white ">
              * installation goes into C:/Kafka
            </label>
            <label className="text-white ">* go to the config folder</label>
            <label className="text-white ">* open zookeeper.properties</label>
            <label className="text-white ">
              * change dataDir=tmp/zookeeper to dataDir=c:/Kafka/zookeeper-data
            </label>
            <label className="text-white ">* open server.properties</label>
            <label className="text-white ">
              * change log.dirs=/tmp/kafka-logs to log.dirs=c:/Kafka/kafka-logs
            </label>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Installation;
