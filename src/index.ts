import * as http from 'http';
import * as readline from 'readline';
import * as querystring from 'querystring';
import * as init from './init-app'
import { EventEmitter } from 'events';
import { Spawner } from './spawner';
import { Handler } from './handler';

const args = init.getArgs()
const config = init.getConfig();
const events = new EventEmitter();

if (args.command) {
    new Spawner(args.command, events);
}

new Handler(args.metadataName, args.outFile, args.templateFile, events);

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
    host: config.host,
    port: config.port,
    path: `/api/v1${args.namespace && '/namespaces/' + args.namespace || ''}/services?watch=true`
}, response => {
    const rl = readline.createInterface({
        input: response
    });

    let i = 0;

    rl.on('line', line => {
        const data = JSON.parse(line);

        getPods(data.object.spec.selector).then(pods => {
            let ports;
            data.object.spec.ports.forEach(x => {
                if (x.nodePort) {
                    ports = ports || {};
                    ports[x.name] = x;
                }
            })

            if (!ports) {
                return;
            }

            data.pods = pods;
            data.ports = ports;
            const nodes = pods.items.map(p => p.spec.nodeName);
            var uSet = new Set(nodes);
            data.nodes = [...uSet];
            events.emit('object', data);
        });
    });
});
