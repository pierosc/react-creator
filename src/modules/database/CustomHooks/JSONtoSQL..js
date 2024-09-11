const jsonExample = [
  {
    _id: {
      $oid: "5efcd6cd509833a8b388ed28",
    },
    itinRecordID: "5efcd6cd509833a8b388ed28",
    recordID: "5efcd6cd509833a8b388ed27",
    fullName: "SOLANO VIGABRIEL, ARACELY VICTORIA",
    firstLastName: "SOLANO VIGABRIEL, ARACELY VICTORIA",
    itinSSN: "973973034",
    phoneNumber: "7036359982",
    itinNoticeDate: "2020-10-19",
    itinPreparer: "MARIA VISALOT",
    itinStatus: "Archive",
    itinInitializationDate: "2020-07-02",
    taxYear: "2019",
    notes: "",
    lastModifiedBy: "alvaro-1",
    lastModifiedDate: "2020-10-23 10:05:31",
    userGroup: "1",
  },
  {
    _id: {
      $oid: "5efcd7c8509833a8b388ed2c",
    },
    itinRecordID: "5efcd7c8509833a8b388ed2c",
    recordID: "5efcd7c8509833a8b388ed2b",
    fullName: "COLQUE BALLESTERO, MELIZA SARETH",
    firstLastName: "COLQUE BALLESTERO, MELIZA",
    itinSSN: "973972141",
    phoneNumber: "2029037660",
    itinNoticeDate: "2020-10-19",
    itinPreparer: "MARIA VISALOT",
    itinStatus: "Archive",
    itinInitializationDate: "2020-07-01",
    taxYear: "2019",
    notes: "",
    lastModifiedBy: "alvaro-1",
    lastModifiedDate: "2020-10-23 09:48:14",
    userGroup: "1",
  },
  {
    _id: {
      $oid: "5efce5a8509833a8b388ed31",
    },
    itinRecordID: "5efce5a8509833a8b388ed31",
    recordID: "5efce5a8509833a8b388ed30",
    fullName: "CABRERA CORTEZ, JOEL",
    firstLastName: "CABRERA CORTEZ, JOEL",
    itinSSN: "973972106",
    phoneNumber: "5712351040",
    itinNoticeDate: "2020-10-19",
    itinPreparer: "IRMA CORDOVA",
    itinStatus: "Archive",
    itinInitializationDate: "2020-07-01",
    taxYear: "2019",
    notes: "",
    lastModifiedBy: "alvaro-1",
    lastModifiedDate: "2021-05-12 16:55:55",
    userGroup: "1",
  },
];

const keysExample = ["recordID", "fullName", "itinSSN", "itinStatus"];
const tableExample = "ITIN";
const migrate = (table, json, keys) => {
  let final = "";
  json.forEach((obj) => {
    const values = keys.map((key) => `"${obj[key]}"`);
    console.log(values);
    const line = `INSERT INTO ${table} (${keys.join()}) VALUES (${values.join()});`;
    console.log(line);
    final = `${final}
${line}`;
  });

  console.log(final);
  return final;
};
