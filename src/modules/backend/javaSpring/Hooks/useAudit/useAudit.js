import React from "react";
import { auditLog } from "./auditLog";
import { auditAspect } from "./auditAspect";
import { auditable } from "./auditable";
import { auditRepository } from "./auditRepository";

function useAudit(springProject) {
  const getAuditEmptyEstructure = () => {};
  const getFiles = () => {};
  let servicesFiles = [
    {
      type: "file",
      name: `auditLog.java`,
      content: auditLog(),
    },
  ];

  return { getAuditEmptyEstructure };
}

export default useAudit;
