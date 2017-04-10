import { EventEmitter } from 'events';
import * as ejs from 'ejs';
import * as fs from 'fs';

export class Handler {
    template: string;
    events: EventEmitter

    constructor(metadataName: string, outFile: string, templateFile: string, events: EventEmitter) {
        this.template = fs.readFileSync(templateFile, 'utf8');
        this.events = events;

        events.on('object', data => {
            let file;
            if (data.object.metadata.name === metadataName) {
                file = outFile;
            }
            else if ('*' === metadataName) {
                file = outFile.replace(/\{(.+?)\}/, (match, x) => {
                    return data.object.metadata[x];
                    
                })
                file = data.object.metadata.name;
            } else {
                return;
            }

            try {
                const content = this.render(data);
                this.write(file, content);
            } catch (e) {
                console.error(e);
            }
        })

    }

    render(data: object): string {
        return ejs.render(this.template, data);
    }

    write(outFile: string, content: string) {
        fs.writeFileSync(outFile, content, 'utf8');
        console.log(`${outFile} generated.`);
        this.events.emit('run-command');
    }
}
