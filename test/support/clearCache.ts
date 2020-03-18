/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from 'fs-extra';
import * as os from 'os';
import * as process from 'process';
import * as rimraf from 'rimraf';
import { parseError } from 'vscode-azureextensionui';
import { isWin32 } from '../../extension.bundle';

const homedir = os.homedir();
const cacheFolder = isWin32
    ? `${process.env.LocalAppData}\\Microsoft\\ARMLanguageServer\\Schemas\\JSON`
    : `${homedir}/.local/share/Microsoft/ARMLanguageServer/Schemas/JSON`;

export async function clearCache(): Promise<void> {
    if (fse.pathExistsSync(cacheFolder)) {
        console.log(`  Cache contents:`);
        console.log((await fse.readdir(cacheFolder)).join(', '));
        try {
            // tslint:disable-next-line:typedef
            await new Promise((resolve, reject) => {
                rimraf(
                    cacheFolder,
                    (error) => {
                        // tslint:disable-next-line: strict-boolean-expressions
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
            });

            if (fse.pathExistsSync(cacheFolder)) {
                console.error(`...Cache folder still exists!`);
            } else {
                console.log(`...Cache folder successfully deleted`);
            }
        } catch (error) {
            console.log("Could not clear cache!");
            console.error(parseError(error).message);
        }
    } else {
        console.log(`Cache folder does not exist`);
    }
}

export async function displayCacheStatus(): Promise<void> {
    if (fse.pathExistsSync(cacheFolder)) {
        console.log(`  Cache contents:`);
        console.log((await fse.readdir(cacheFolder)).join(', '));
    } else {
        console.log(`Cache folder does not exist: ${cacheFolder}`);
    }
}
