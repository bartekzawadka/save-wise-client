import Config from './config';

const ApiCalls = {
    getPlanUrl: () => Config.apiUrl + '/plan',
    getCurrentPlanUrl: () => Config.apiUrl + '/plan/current',
    getPlansGetByIdUrl: (id) => Config.apiUrl + '/plan/' + id,
    getNewPlanGetUrl: () => Config.apiUrl+'/plan/new',
    getIncomeCategoriesPostMultipleUrl: () => Config.apiUrl+"/category/income/multiple"
};

export default ApiCalls;
