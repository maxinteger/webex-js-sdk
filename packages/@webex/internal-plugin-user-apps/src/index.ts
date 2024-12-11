/*!
 * Copyright (c) 2015-2020 Cisco Systems, Inc. See LICENSE file.
 */

import {registerInternalPlugin} from '@webex/webex-core';

import '@webex/internal-plugin-conversation';
import '@webex/internal-plugin-device';
import UserApps from './userApps';
import config from './config';

registerInternalPlugin('userApps', UserApps, {
  config,
  payloadTransformer: {
    predicates: [],
    transforms: [],
  },
});

export {default} from './userApps';
