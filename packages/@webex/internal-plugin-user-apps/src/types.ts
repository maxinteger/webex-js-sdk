/**
 * Full documentation can be found here:
 * https://confluence-eng-gpk2.cisco.com/conf/display/WBXT/Raindrop%3A+Sections
 */

type BaseAppDataItem = {
  url: string;
  'app-name':
    | 'embeddedappsfavorite'
    | 'embeddedappsdonotshowmsginfo'
    | 'client-states'
    | 'embeddedappslastused'
    | 'embeddedappssidebarpinned';
  items: Array<unknown>;
};

/**
 * Flags
 */

type AppDataFlagsItem = {
  id: string;
  url: string;
  state: 'flagged' | 'unflagged' | 'archived';
  'date-created': string;
  'date-updated': string;
  'conversation-url': string;
  'flag-item': string;
};

type AppDataFlag = {
  url: string;
  'app-name': 'flags';
  items: Array<AppDataFlagsItem>;
};

/**
 * sections
 */

type AppDataSectionMetadataDefaultSectionSettings = {
  section_name: 'FAVORITES' | 'OTHER';
  settings: Array<{name: string; value: string}>;
};

type AppDataSectionMetadata = {
  clientSpecificData: {
    sortedSections: Array<string>;
    Default_Sections_Settings: Array<AppDataSectionMetadataDefaultSectionSettings>;
  };
  'default-encryption-key': string;
  'kms-resource-object': string;
};

type AppDataSectionItem = {
  id: string;
  url: string;
  list: string;
  clientSpecificData: {
    pendingSectionId: string;
  };
  content: string;
  'list-app-name': string;
  'date-created': string;
  'date-updated': string;
  'encryption-key': string;
};

type AppDataSection = {
  id: string;
  url: string;
  'app-name': 'sections';
  metadata: AppDataSectionMetadata;
  items: Array<AppDataSectionItem>;
};

type AppDataSectionDerivedItem = {
  id: string;
  url: string;
  'app-type': 'sections';
  'date-created': string;
  'date-updated': string;
  'conversation-url': string;
};

type AppDataSectionDerived = {
  url: string;
  'app-name': `sections_${string}`;
  'app-type': 'sections';
  items: Array<AppDataSectionDerivedItem>;
};

/**
 * All
 */

type AppDataStaticItem = BaseAppDataItem | AppDataFlag;

export type AppsData = {
  items: {
    static: Array<AppDataStaticItem>;
    dynamicTop: Array<AppDataSection>;
    dynamicDerived: Array<AppDataSectionDerived>;
  };
};
