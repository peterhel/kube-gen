import * as  http from 'http';
import * as readline from 'readline';
import * as querystring from 'querystring';

const ejs = require('ejs');

// Compile the source code

function getPods(selector): any {
    return new Promise(resolve => {
        http.get({
            host: 'seh-docker-mgr01.3db.local',
            port: 8080,
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
                require('fs').writeFileSync(process.argv[4], ejs.render(require('fs').readFileSync(process.argv[3], 'utf8'), data), 'utf8')
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