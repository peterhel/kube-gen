import * as fs from 'fs';
import * as program from 'commander';
import { Args } from './args';

export function getArgs(): Args {
    program
        .arguments('<metadataName>')
        .arguments('<templateFile>')
        .arguments('<outFile>')
        .option('-c, --cmd [value]', 'Command to execute when template has been updated.')
        .option('-n, --namespace [value]', 'Kubernetes namespace')
        .parse(process.argv);

    if (process.argv.length < 5) {
        program.outputHelp();
        process.exit(1);
    }

    const [metadataName, templateFile, outFile] = program.args;

    return new Args(metadataName, templateFile, outFile, program.cmd, program.namespace);
}

export function getConfig() {
    let config;

    const defaultConfig = {
        host: '127.0.0.1',
        port: 8001
    }

    if (!fs.existsSync('/etc/kubegen/config.json')) {
        console.error(`No config file found at '/etc/kubegen/config.json'`);
        console.error(`Defaulting to the following:`);
        console.error(JSON.stringify(defaultConfig, null, 2));
        config = defaultConfig;
    } else {
        const configContent = fs.readFileSync('/etc/kubegen/config.json', 'utf8');
        config = JSON.parse(configContent);
    }

    return config;
}
