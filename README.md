# kubegen
## a kubernetes ejs template generator

I was too stupid to grasp Ingress so I made a simple tool for generating files based on ejs templates whenever a change occurs in a Kubernetes cluster.

*Installation*
```
npm install -g kubegen
```

*Usage*
```
Usage: kubegen [options] <metadataName> <templateFile> <outFile>

Options:

  -h, --help         output usage information
  -c, --cmd [value]  Command to execute when template has been updated.

```
