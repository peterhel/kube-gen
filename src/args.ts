export class Args {
    metadataName: string;
    templateFile: string;
    outFile: string;
    command: string;
    namespace: string;

    constructor(metadataName, templateFile, outFile, command, namespace) {
        this.metadataName = metadataName;
        this.templateFile = templateFile;
        this.outFile = outFile;
        this.command = command;
        this.namespace = namespace;
    }
}