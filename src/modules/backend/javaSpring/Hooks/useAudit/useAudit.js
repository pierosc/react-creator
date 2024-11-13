import React from "react";
import { auditLog } from "./auditLog";
import { auditAspect } from "./auditAspect";
import { auditable } from "./auditable";
import { auditRepository } from "./auditRepository";

function useAudit(springProject) {
  const metaData = springProject?.selected?.metaData ?? {};
  const getAuditEmptyEstructure = () => {
    return [
      {
        type: "file",
        name: `auditLog.java`,
        content: auditLog(metaData),
      },
      {
        type: "file",
        name: `auditAspect.java`,
        content: auditAspect(metaData),
      },
      {
        type: "file",
        name: `auditable.java`,
        content: auditable(metaData),
      },
      {
        type: "file",
        name: `auditRepository.java`,
        content: auditRepository(metaData),
      },
    ];
  };
  const files = () => {
    return [
      {
        type: "file",
        name: `AuditLog.java`,
        content: auditLog(metaData),
      },
      {
        type: "file",
        name: `AuditAspect.java`,
        content: auditAspect(metaData),
      },
      {
        type: "file",
        name: `Auditable.java`,
        content: auditable(metaData),
      },
      {
        type: "file",
        name: `AuditRepository.java`,
        content: auditRepository(metaData),
      },
    ];
  };

  return { getAuditEmptyEstructure, files };
}

export default useAudit;
