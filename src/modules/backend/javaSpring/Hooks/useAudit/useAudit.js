import React from "react";
import { auditLog } from "./auditLog";
import { auditAspect } from "./auditAspect";
import { auditable } from "./auditable";
import { auditRepository } from "./auditRepository";

function useAudit(springProject) {
  const getAuditEmptyEstructure = (metaData) => {
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
  const getFiles = () => {};
  let servicesFiles = [
    {
      type: "file",
      name: `auditLog.java`,
      content: auditLog(),
    },
    {
      type: "file",
      name: `auditAspect.java`,
      content: auditAspect(),
    },
    {
      type: "file",
      name: `auditable.java`,
      content: auditable(),
    },
    {
      type: "file",
      name: `auditRepository.java`,
      content: auditRepository(),
    },
  ];

  return { getAuditEmptyEstructure };
}

export default useAudit;
