'use strict';

let events = {
	xmlrpc: {
		test_method: 'xmlrpc.v1.TestMethod'
	}
};

let tasks = [{
	name: 'xmlrpc.v1.TestMethod',
	handler: 'TestMethod'
}, {
	name: 'xmlrpc.v1.TestLogin',
	handler: 'TestLogin'
}, {
	name: 'xmlrpc.v1.OperatorNextRequest',
	handler: 'OperatorNextRequest'
}, {
	name: 'xmlrpc.v1.OperatorNextRequest2',
	handler: 'OperatorNextRequest2'
}, {
	name: 'xmlrpc.v1.OperatorRequestInProgress',
	handler: 'OperatorRequestInProgress'
}, {
	name: 'xmlrpc.v1.OperatorRequestInProgress2',
	handler: 'OperatorRequestInProgress2'
}, {
	name: 'xmlrpc.v1.OperatorPostponeRequest',
	handler: 'OperatorPostponeRequest'
}, {
	name: 'xmlrpc.v1.OperatorPostponeRequest2',
	handler: 'OperatorPostponeRequest2'
}, {
	name: 'xmlrpc.v1.OperatorCompleteRequest',
	handler: 'OperatorCompleteRequest'
}, {
	name: 'xmlrpc.v1.OperatorCompleteRequest2',
	handler: 'OperatorCompleteRequest2'
}, {
	name: 'xmlrpc.v1.OperatorPause',
	handler: 'OperatorPause'
}, {
	name: 'xmlrpc.v1.OperatorUpdate2',
	handler: 'OperatorUpdate2'
}, {
	name: 'xmlrpc.v1.OperatorUpdate3',
	handler: 'OperatorUpdate3'
}, {
	name: 'xmlrpc.v1.OperatorLogout',
	handler: 'OperatorLogout'
}, {
	name: 'xmlrpc.v1.OperatorEnterWithRelativeId',
	handler: 'OperatorEnterWithRelativeId'
}, {
	name: 'xmlrpc.v1.OperatorAuthenticate',
	handler: 'OperatorAuthenticate'
}, {
	name: 'xmlrpc.v1.OperatorListOperators',
	handler: 'OperatorListOperators'
}, {
	name: 'xmlrpc.v1.OperatorGetRequests',
	handler: 'OperatorGetRequests'
},
//
// Админка
//
{
	name: 'xmlrpc.v1.SettingsGet',
	handler: 'SettingsGet'
}, {
	name: 'xmlrpc.v1.ListServices',
	handler: 'ListServices'
}, {
	name: 'xmlrpc.v1.ListRelServiceGroups',
	handler: 'ListRelServiceGroups'
},
//
// WEB-виджет
//
{
	name: 'xmlrpc.v1.ListOffices',
	handler: 'ListOffices'
}, {
	name: 'xmlrpc.v1.ListWebOffices',
	handler: 'ListWebOffices'
}, {
	name: 'xmlrpc.v1.SetCurrentOfficeId',
	handler: 'SetCurrentOfficeId'
}, {
	name: 'xmlrpc.v1.GetTopLevelServices',
	handler: 'GetTopLevelServices'
}, {
	name: 'xmlrpc.v1.GetServicesByOfficeIdGroupId',
	handler: 'GetServicesByOfficeIdGroupId'
}, {
	name: 'xmlrpc.v1.ListTimesAvailable',
	handler: 'ListTimesAvailable'
}, {
	name: 'xmlrpc.v1.CreateRequest',
	handler: 'CreateRequest'
}];

module.exports = {
	module: require('./xmlrpc.js'),
	permissions: [],
	tasks: tasks,
	events: {
		group: 'xmlrpc.v1',
		shorthands: events.xmlrpc
	}
};