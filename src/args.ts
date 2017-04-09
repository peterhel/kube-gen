export class Args {
    metadataName: string;
    templateFile: string;
    outFile: string;
    command: string;

    constructor(metadataName, templateFile, outFile, command) {
        this.metadataName = metadataName;
        this.templateFile = templateFile;
        this.outFile = outFile;
        this.command = command;
    }
}