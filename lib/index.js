// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

'use strict';

const path = require('path');
const { download } = require('./download');
const fs = require('fs');
const promisfy = require('util').promisify;
const FSRmDir = promisfy(fs.rm);
const FSStat = promisfy(fs.stat);

/**
 * Downloads the ZMQ binaries.
 *
 * @param {string | undefined} [customDir] If provided, the directory to download the binaries to.
 * @export
 * @return {*}  {Promise<void>}
 */
module.exports.downloadZMQ = async (customDir = undefined) => {
  let destination = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'zeromq',
    'prebuilds'
  );

  if (customDir) {
    if (!fs.existsSync(customDir)) {
      throw new Error(`Custom directory does not exist: ${customDir}`);
    }

    destination = customDir;
  } else {
    if (!fs.existsSync(path.dirname(destination))) {
      throw new Error(
        `zeromq package does not exist in node modules folder (${path.dirname(
          destination
        )})`
      );
    }
  }

  // Delete to ensure we always download (this guarantees the fact that the binaries are what we expect them to be).
  await deleteZmqFolder(destination);

  const downloadOptions = {
    destination,
  };

  await download(downloadOptions);
};

async function deleteZmqFolder(destination) {
  const exists = FSStat(destination)
    .then(() => true)
    .catch(() => false);
  if (await exists) {
    console.log('Deleting existing zeromq binaries', destination);
    await FSRmDir(destination, { recursive: true });
  }
}
