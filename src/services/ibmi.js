const debug = require("debug")("login");
const { Connection, ProgramCall } = require("itoolkit");
const { parseString } = require("xml2js");
const { resolve } = require("path");
const { rejects } = require("assert");

function QSYSGETPH(user, pw) {
  return new Promise((resolve, reject) => {
    debug("Authentification");
    const conn = new Connection({
      transport: "idb",
      transportOptions: {
        database: "*LOCAL",
        username: user.toUpperCase(),
        password: pw.toUpperCase(),
      },
    });

    const program = new ProgramCall("QSYGETPH", { lib: "QSYS" });

    // User ID	Input	Char(10)
    program.addParam({ value: user.toUpperCase(), type: "10A" });
    // Password	Input	Char(*)
    program.addParam({ value: pw.toUpperCase(), type: "10A" });
    // Profile handle	Output	Char(12)
    program.addParam({ value: "", type: "12A", io: "out", hex: "on" });
    const errno = {
      name: "error_code",
      type: "ds",
      io: "both",
      len: "rec2",
      fields: [
        {
          name: "bytes_provided",
          type: "10i0",
          value: 0,
          setlen: "rec2",
        },
        { name: "bytes_available", type: "10i0", value: 0 },
        { name: "msgid", type: "7A", value: "" },
        { type: "1A", value: "" },
      ],
    };
    // Error code	I/O	Char(*)
    program.addParam(errno);
    // Length of password	Input	Bin(4)
    program.addParam({ value: 10, type: "10i0" });
    // CCSID of password	Input	Bin(4)
    program.addParam({ value: 0, type: "10i0" });

    conn.add(program);

    try {
      conn.run((error, xmlOutput) => {
        if (error) {
          debug("Error login %O", error);
          reject({ error: "Authentification failed" });
        } else {
          parseString(xmlOutput, (parseError, result) => {
            debug("Parse result %O", result.myscript.pgm[0]);
            if (parseError) {
              debug("Parse error login %O", parseError);
              throw parseError;
            }
            resolve({ result: result.myscript.pgm[0].success });
          });
        }
      });
    } catch {
      debug("Error login %O", error);
      reject({ error: "Authentification failed" });
    }
  });
}

exports.QSYSGETPH = QSYSGETPH;
