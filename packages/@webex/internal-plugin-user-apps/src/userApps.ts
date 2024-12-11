/*!
 * Copyright (c) 2015-2020 Cisco Systems, Inc. See LICENSE file.
 */
import * as WebexCore from '@webex/webex-core';
import {AppsData} from './types';

const UserApps = WebexCore.WebexPlugin.extend({
  namespace: 'Section',

  /**
   * Last sync with user apps service
   * @instance
   * @memberof AuthorizationBrowserFirstParty
   * @type {number}
   * @public
   */
  lastSync: -1,

  /**
   * User apps data
   * @instance
   * @memberof UserApps
   * @type {import('./types').AppsData|null}
   * @public
   */
  userAppsData: null,

  /**
   * Fetch all user apps data
   *
   * @param {boolean} force
   * @returns {Promise<AppsData>}
   */
  fetchAppsData(force = false) {
    const isSync = this.lastSync > 0;

    if (!force && isSync && this.lastSync + 1000 * 60 * 5 > Date.now()) {
      return Promise.resolve(this.userAppsData);
    }

    // TODO implement sync logic
    // see catchup docs: https://confluence-eng-gpk2.cisco.com/conf/display/WBXT/Raindrop%3A+Support+Multiple+Lists#Raindrop:SupportMultipleLists-GET/user/app/v1/apps/catchup
    //
    // if (isSync) {
    //   return this.request({
    //     service: 'userApps',
    //     resource: '/apps/catchup',
    //     method: 'GET',
    //     qs: {since: Math.floor(this.lastSync / 1000)},
    //   }).then((res) => {
    //     this.userAppsData = res.body;
    //     this.lastSync = Date.now();
    //
    //     return res.body;
    //   });
    //
    // }

    return this.request({
      service: 'userApps',
      resource: '/',
      method: 'GET',
    }).then((res) => {
      this.userAppsData = res.body;
      this.lastSync = Date.now();

      return res.body as AppsData;
    });
  },

  /**
   * Get map section to conversation
   *
   * Special sections like Favorites and Other doesn't have associated conversations,
   * but they are part of the section list because of the ordering.
   * When a conversation not listed in any of the section, it should be in the Favorites
   * (if the `isFavorite` is true on the conversation object) otherwise it should be in the Other section.
   *
   * @returns {Promise<Array<{sectionId: string, conversationIds: string[]}>>} Ordered array of sectionId and the list of conversationIds
   */
  getMapSectionToConversation() {
    return this.fetchAppsData().then((appsData: AppsData) => {
      if (!appsData || !appsData.items.dynamicTop) return [];
      try {
        const sectionData = appsData.items.dynamicTop.find(
          (item) => item['app-name'] === 'sections'
        );

        const sections = appsData.items.dynamicTop.find((item) => item['app-name'] === 'sections');

        return Promise.all(
          sectionData.metadata.clientSpecificData.sortedSections.map(async (sectionId) => {
            const result = {sectionId, sectionTitle: sectionId, conversationIds: []};

            const section = sections.items.find((item) => item.id === sectionId);

            // If it is a system section like Favorites or Other, then return with the default result
            if (!section) {
              return result;
            }

            // Get the section sub list with conversation ids
            const sectionSubType = appsData.items.dynamicDerived.find(
              (item) => item['app-name'] === section['list-app-name']
            );

            // Get the conversation ids from the conversation-url
            result.conversationIds = (sectionSubType?.items ?? []).map((sectionItem) =>
              sectionItem['conversation-url'].split('/').pop()
            );

            // Decrypt the section title
            result.sectionTitle = await this.webex.internal.encryption.decryptText(
              section['encryption-key'],
              section.content
            );

            return result;
          })
        );
      } catch (error) {
        return [];
      }
    });
  },
});

export default UserApps;
