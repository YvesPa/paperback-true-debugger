# Project Name - Debugging Tool for Paperback Sources (Proof of Concept)

## Introduction

Welcome to the debugging tool for Paperback sources, a Proof of Concept (POC) project aimed at providing an essential debugging utility for developers working with Paperback sources. This POC may eventually evolve into an installable dependency or be integrated directly into the Paperback CLI.

The primary goal of this POC is to facilitate the debugging process for Paperback source developers by offering a dedicated debugging tool.

## Installation of the Debug Source

To get the debugging tool up and running, you need to install a debug source on the application. Follow these steps:

1. Navigate to the `source` directory.
2. Install the necessary dependencies:
    ```sh
    npm install
    ```
3. Create the debug source by executing the creation script:
    ```sh
    npx ts-node .\DebugFactory.ts <SourceName> <ipServer>
    ```
    For example:
    ```sh
    npx ts-node .\DebugFactory.ts MangaPlus 192.168.1.150
    ```
4. Start the Paperback server:
    ```sh
    npx paperback serve
    ```
5. Finally, install the extension on the Paperback application.

## Setting Up the Server

To set up the server, follow these steps:

1. Navigate to the `server` directory.
2. Install the necessary dependencies:
    ```sh
    npm install
    ```
3. Install additional local dependencies:
    ```sh
    npm install --save-dev ts-node nodemon
    ```
4. Copy the source you want to debug into the `src/Source` directory.
5. Update the `src/main.ts` file:
   - Update the IP address.
   - Create an instance of the copied source.
6. Start the server:
    ```sh
    npm run start
    ```
7. To activate debug mode, you can launch it using a JavaScript debug terminal (or equivalent).

## Current Limitations

Please note that the following features are not yet supported in this POC:

- Data stored in source states
- Management of parameters
- Not all providers are implemented (like cloudflare)

## Overall Workflow Diagram

Below is a schematic overview of how the debugging tool integrates with the Paperback application and server.

![Workflow Diagram](https://i.ibb.co/XtF3dcz/Workflow.png)


This README provides the essential instructions to get you started with the debugging tool for Paperback sources. As this is a POC, future updates and enhancements are expected. Stay tuned for more features and improvements!
