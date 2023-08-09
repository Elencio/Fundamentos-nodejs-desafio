import fs from "fs";
import csv from "csv-parse";
import { Transform } from "stream";

path = new URL('./task.csv', import.meta.url)

const readableStream = fs.createReadStream(path);
const transformStream = csv({ separator: ';', columns: true  });

const transformStreamString = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    callback(null, JSON.stringify(chunk) + '\n'); 
  }
});


async function run() {
  await wait(1000); 
  const linesParse = readableStream.pipe(transformStream).pipe(transformStreamString);

  for await (const line of linesParse) {
    try {
      const data = JSON.parse(line);
      const { title, description } = data;

      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      });

      console.log('Dados enviados:', data);
    } catch (error) {
      console.error('Erro', error);
    }
  }
}

run();

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
