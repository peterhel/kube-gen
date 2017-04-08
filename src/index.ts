import * as http from 'http';
import * as readline from 'readline';
import * as querystring from 'querystring';
import * as init from './init-app'
import * as ejs from 'ejs';

const args = init.getArgs()
const config = init.getConfig();

// Compile the source code

async function getPods(selector): Promise<any> {
    return await new Promise(resolve => {
        http.get({
            host: config.host,
            port: config.port,
            path: `/api/v1/pods?labelSelector=${encodeURIComponent(querystring.stringify(selector))}`
        }, response => {
            let content = '';

            response.on('data', chunk => {
                content += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(content.toString()));
            })
        })
    })
}


function render(data) {

}

http.get({
    host: 'seh-docker-mgr01.3db.local',
    port: 8080,
    path: `/api/v1/services?watch=true`
}, response => {
    const rl = readline.createInterface({
        input: response
    });

    let i = 0;

    rl.on('line', line => {
        const data = JSON.parse(line);
        if (data.object.metadata.name === process.argv[2]) {
            getPods(data.object.spec.selector).then(pods => {
                const ports = {}
                data.object.spec.ports.forEach(x => {
                    ports[x.name] = x;
                })
                data.pods = pods;
                data.ports = ports;
                require('fs').writeFileSync(args.outFile, ejs.render(require('fs').readFileSync(process.argv[3], 'utf8'), data), 'utf8')
                if(args.command) {
                    console.log(`Running command: ${args.command}`);
                }
            });
        }
    });
});

/*
resp = requests.get('http://localhost:8001/api/v1/pods',
                    params={'watch': 'true'}, stream=True)
for line in resp.iter_lines():
    event = json.dumps(line)
 */