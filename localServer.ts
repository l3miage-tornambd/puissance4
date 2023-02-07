import {Request, Response} from "express-serve-static-core";
import {readFileSync, writeFileSync, existsSync, renameSync} from 'fs'
const express = require('express')
const app = express()
const port = 4100
app.use(express.json());

const path = require('path')
app.use('/coverage', express.static(path.join(__dirname, '/coverage/l3m-va-puissance4-2023')))
app.use('/mutants', express.static(path.join(__dirname, '/reports/mutation')))

const dirPath = `./src/app/data-tests`;
const strDeclaration = "export const dataTests = ";

app.get('/', (req: Request, res: Response) => {
  const fName = `${dirPath}/tests.ts`;
  if (existsSync(fName)) {
    const str = readFileSync(fName, {encoding: 'utf-8'}).slice(strDeclaration.length)
    res.json( JSON.parse(str) );
  } else {
    res.json({
      userMail: "pipo",
      version: -1,
      testSuites: []
    })
  }
})

app.post('/', (req: Request, res: Response) => {
  const fName = `${dirPath}/tests.ts`;
  if (existsSync(fName)) {
    // Rename it
    renameSync(fName, `${dirPath}/tests.${Date.now()}.ts`)
  }
  // Save new
  try {
    writeFileSync(fName, `${strDeclaration}${JSON.stringify(req.body)}`, {encoding: "utf-8",flag:'w'} )
    res.json({saved: true, data: req.body} );
  } catch(err) {
    res.status(500).json({saved: false, reason: err} );
  }
})

app.listen(port, () => {
  console.log(`L3M VA puissance 4 test server running on port ${port}`)
})
