'use strict';

export default interface CmdGenInterface {
    updateConfig(cscop_config : object);
    checkToolCmd() : string;
    listFileCmd() : string;
    buildDatabaseCmd() : string;
    findAllRefCmd() : string;
    findDefineCmd() : string;
    findCalleeCmd() : string;
    findCallerCmd() : string;
    findTextCmd() : string;
};
