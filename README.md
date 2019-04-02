Secure API with Express
===

Example of a secure Node.js API written with the framework Express.

Autenthification from IBMi with [QSYSGETPH](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_73/apis/QSYGETPH.htm) API.

Signature with [JWT](https://jwt.io/).



Getting started
---

Install the dependencies
```
$ npm install
```
Generate certificats
```
$ openssl genrsa -out api-with-express-key.pem 2048
```
```
$ openssl req -new -sha256 -key api-with-express-key.pem -out api-with-express-csr.pem
```
```
$ openssl x509 -req -in api-with-express-csr.pem -signkey api-with-express-key.pem -out api-with-express-cert.pem
```

Duplicate the table **QIWS/QCUSTCDT** in your library.

Change configuration in *config* folder :
- port: Port number for HTTP
- port_secure: Port number for HTTPS
- schema: library for QCUSTCDT
- secret: passphrase for encoding/decoding JWT
- jwt_option: Options fir signin JWT

Start the project
```
$ npm start 
```

Use it
- First call the /login with profile/password. 
  - It will return au jwt if login success.
  - If the login fails, it return an error.
- Then call the API with the token 


License
---

MIT