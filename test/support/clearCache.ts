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

export async function clearCache(): Promise<void> {
    const homedir = os.homedir();
    const cacheFolder = isWin32
        ? `${process.env.LocalAppData}\\Microsoft\\ARMLanguageServer\\Schemas\\JSON`
        : `${homedir}/.local/share/Microsoft/ARMLanguageServer/Schemas/JSON`;
    console.log(`Clearing cache at ${cacheFolder}`);
    if (fse.pathExistsSync(cacheFolder)) {
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

            console.log(`Cache cleared`);
        } catch (error) {
            console.log("Could not clear cache!");
            console.error(parseError(error).message);
        }
    }

}
