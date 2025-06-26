/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
'use strict'
let Promise = require('bluebird');
let _ = require("lodash");
let qs = require("querystring");
let request = Promise.promisify(require("request"));
let emitter = require("global-queue");

//REPLICATOR

class XmlRpcV1 {
	constructor() {
		this.emitter = emitter;
	}

	init(config) {
	}

	//API

	TestMethod(name) {
		return Promise.resolve("Hello " + name + "!");
	}

	TestLogin(params) {
		if (!_.isArray(params) || params.length < 2) {
			return Promise.reject(false);
		}
		let login = params[0], password = params[1], origin = "";
		if (params.length > 2) {
			origin = params[2];
		}
		console.log('TestLogin succeed:', params);
		return Promise.resolve(true);
	}
	
	//
	// Пульт оператора
	//
	
	// Ожидает ни одного, один, либо два параметра: номер талона для вызова, номер отложенного ранее талона для вызова.
	// При вызове без параметров вызывает первого посетителя в очереди.
	// При вызове с одним параметром, вызывает посетителя, номер талона которого указан при вызове.
	// При вызове с двумя параметрами (первый из них должен быть null), вызывает отложенного посетителя, номер талона которого указан вторым параметром при вызове.
	// возвращает массив из номера вызванного талона и наименования и описания услуги, на которую он был выдан,
	// либо null, если талон не был вызван.
	OperatorNextRequest(params) {
		let req = this._OperatorNextRequestImpl(params);
		if (!req) {
			return Promise.resolve(null);
		}
		return Promise.resolve(this._prepareRequest2(req));
	}
	
	// То же, что и OperatorNextRequest, только всегда возвращает структуру и никогда null
	OperatorNextRequest2() {
		let req = this._OperatorNextRequestImpl(params);
		return Promise.resolve(this._prepareRequest2(req));
	}
	
	// @TODO: заменить на реальный механизм локализации строк
	_tr(str) {
		return str;
	}
	
	GetCurrentOperatorId() {
		// @TODO: Номер окна определяется по токену текущей сессии
		return null;
	}
	
	GetCurrentEmployeeId() {
		// @TODO: Номер сотрудника определяется по токену текущей сессии
		return null;
	}
	
	// @TODO: тут много нереализованных функций
	_prepareRequest2(req) {
		let strRequest = {
			"Id": -1
			, "HrId": null
			, "ClientInfo": null
			, "ServiceName": null
			, "ServiceId": -1
			, "ServiceShortDesc": null
			, "waitTime": this._tr("Undefined")
			, "ServiceCount": -1
			, "ServiceTimeLength": -1
			, "GlobalServiceId": -1
			, "serviceRPGUCode": ""
		};
		if (req) {
			let intOperatorId = this.GetCurrentOperatorId();
			let intEmployeeId = this.GetCurrentEmployeeId();
			let svc = req.Service;
			if (!svc) {
				// попытка получить талон из чужого офиса
				return Promise.resolve(strRequest);
			}
			let intServiceId = svc.Id;
			// @TODO
			let intOperationTime = svc.GetOperationTime(req.TypeId, intOperatorId, intEmployeeId);
			let strRpguServiceCode = svc.service_rpguID;
			strRequest = {
				"Id": req.Id // тут должно быть именно целое число! int32
				, "HrId": (req.HrId + '') // string
				, "ClientInfo": req.ClientInfo // string
				, "ServiceName": svc.Name // string
				, "ServiceId": intServiceId // int32
				, "ServiceShortDesc": svc.ShortDesc // string
				// @TODO
				, "waitTime": req.CalcWaitTime() // string
				, "ServiceCount": req.ServiceCount // int32
				, "ServiceTimeLength": req.ServiceCount * intOperationTime // int32
				, "GlobalServiceId": -1 // int32
				, "serviceRPGUCode": strRpguServiceCode // string
			};
			let intGlobalServiceId = svc.GlobalServiceId;
			if (intGlobalServiceId) {
				strRequest["GlobalServiceId"] = intGlobalServiceId; // int32
			}
//			$strExtendedInfo = req.ExtendedInfo;
//			if ($strExtendedInfo) {
//				$objExtendedInfo = json_decode($strExtendedInfo, true/*associative*/);
//				if ($objExtendedInfo) {
//					foreach ($objExtendedInfo as $key => $value) {
//						strRequest[$key] = $value;
//					}
//				}
//			}
		}
		return Promise.resolve(strRequest);
	}
	
	// не ожидает параметров
	// возвращает номер талона, чей приход подтверждён, либо null, если подтверждение не состоялось.
	OperatorRequestInProgress() {
		// @TODO: вызвать следующий доступный талон и вернуть его номер (int32)
		// или null, если никого вызвать не удалось
		return Promise.resolve(null);
	}
	
	// не ожидает параметров
	// возвращает номер талона, чей приход подтверждён, либо -1, если подтверждение не состоялось.
	OperatorRequestInProgress2() {
		let res = this.OperatorRequestInProgress();
		if (!res) {
			return -1;
		}
		return Promise.resolve(res);
	}
	
	// не ожидает параметров
	// возвращает номер отложенного талона, либо null, если отложить не удалось
	OperatorPostponeRequest() {
		// @TODO:
		return Promise.resolve(null);
	}
	
	// не ожидает параметров
	// возвращает номер отложенного талона, либо -1, если отложить не удалось
	OperatorPostponeRequest2() {
		let res = this.OperatorPostponeRequest();
		if (!res) {
			return Promise.resolve(-1);
		}
		return Promise.resolve(res);
	}
	
	// не ожидает параметров
	// возвращает ID талона, который обслуживался до вызова метода или null,
	// если ни один талон не обслуживался
	OperatorCompleteRequest() {
		// @TODO:
		return Promise.resolve(null);
	}
	
	// не ожидает параметров
	// возвращает ID талона, который обслуживался до вызова метода или -1,
	// если ни один талон не обслуживался
	OperatorCompleteRequest2() {
		let res = this.OperatorCompleteRequest();
		if (!res) {
			return Promise.resolve(-1);
		}
		return Promise.resolve(res);
	}
	
	// Не ожидает параметров
	// возвращает 1 в случае удачного исхода, и 0, если начать перерыв не удалось
	OperatorPause() {
		// @TODO:
		return Promise.resolve(0);
	}
	
	// Обновляет время последнего доступа оператора и откладывает талон, если посетитель вовремя не подошел.
	// Должен вызываться достаточно часто, например, раз в 5 секунд, иначе произойдёт автоматический logout оператора.
	// Время, по истечению которого это произойдёт, определяется настройкой ЭО operator_autologoff_timeout
	// не ожидает параметров
	OperatorUpdate2() {
		let intPostponedRequest = this._checkPostponed();
		let openedAndPostponedRequestsCount = this._getOpenedAndPostponedRequestsCount();
		let intLastOfficeRequestId = this._getLastOfficeRequestId();
		return Promise.resolve({
			// возвращает номер отложенного талона, либо -1, если талон не был отложен
			"postponedRequestId": (intPostponedRequest ? intPostponedRequest : -1)
			, "requestsCount": openedAndPostponedRequestsCount.openedCount
			, "postponedRequestsCount": openedAndPostponedRequestsCount.postponedCount
			, "lastCreatedRequestId": intLastOfficeRequestId
			// https://irisdev/iristrac/ticket/2319#comment:2
			// Вместе с результатом всегда кладём в кэш и отсылаем потом клиенту метку времени -
			// когда этот результат был насчитан.
			, "resultTimestamp": (new Date).getTime() / 1000
		});
	}
	
	OperatorUpdate3() {
		let intPostponedRequest = this._checkPostponed();
		let openedAndPostponedRequestsCount = this._getOpenedAndPostponedRequestsCount();
		let intLastOfficeRequestId = this._getLastOfficeRequestId();
		// @TODO: время, оставшееся до автовызова следующего в очереди талона, если включен ункционал, иначе -1
		let autoCallTimeout = -1;
		// @TODO: вызвать следующий талон, если оператор свободен и бездействует дольше operator_auto_call_request_timeout
		let objCalledRequest = null;
		let strCalledRequest = this._prepareRequest2(objCalledRequest);
		return Promise.resolve({
			// возвращает номер отложенного талона, либо -1, если талон не был отложен
			"postponedRequestId": (intPostponedRequest ? intPostponedRequest : -1)
			, "requestsCount": openedAndPostponedRequestsCount.openedCount
			, "postponedRequestsCount": openedAndPostponedRequestsCount.postponedCount
			, "lastCreatedRequestId": intLastOfficeRequestId
			// https://irisdev/iristrac/ticket/2319#comment:2
			// Вместе с результатом всегда кладём в кэш и отсылаем потом клиенту метку времени -
			// когда этот результат был насчитан.
			, "resultTimestamp": (new Date).getTime() / 1000

			, "requestId": strCalledRequest['Id'], 
			"requestHrId": strCalledRequest['HrId'], 
			"requestClientInfo": strCalledRequest['ClientInfo'], 
			"requestServiceName": strCalledRequest['ServiceName'], 
			"requestServiceId": strCalledRequest['ServiceId'], 
			"requestGlobalServiceId": strCalledRequest['GlobalServiceId'], 
			"requestServiceDesc": strCalledRequest['ServiceShortDesc'], 
			"requestState": objCalledRequest ? objCalledRequest.StateId : -1,
			"requestWaitTime": strCalledRequest['waitTime'],
			"requestServiceCount": strCalledRequest['ServiceCount'],
			"requestTimeLength": strCalledRequest['ServiceTimeLength'],
			"requestServiceRPGUCode": strCalledRequest['serviceRPGUCode'],
			"autoCallTimeout": autoCallTimeout
		});
	}
	
	/**
	 * Проверяет, есть ли вызванный талон, и не пора ли ему упасть в отложенные
	 * 
	 * @return {Number} Номер отложенного талона, или null
	 */
	_checkPostponed() {
		return null;
	}
	
	/**
	 * @TODO: Возвращает количества доступных для вызова и отложенных талонов
	 */
	_getOpenedAndPostponedRequestsCount() {
		return {
			openedCount: 0,
			postponedCount: 0
		};
	}
	
	/**
	 * @return {Number} Номер последнего созданного в офисе талона, или -1,
	 * если нет текущего офиса или в офисе нет талонов
	 */
	_getLastOfficeRequestId() {
		// @TODO:
		return -1;
	}
	
	// Не ожидает параметров
	// возвращает 1 в случае удачного исхода, и ошибку с кодом __EQUEUE_XMLRPC_ERRORCODE_DB__, если выйти не удалось
	//define ('__EQUEUE_XMLRPC_ERRORCODE_DB__', 1);
	//define ('__EQUEUE_XMLRPC_ERRORCODE_BADPARAM__', 2);
	OperatorLogout() {
		// @TODO: реализовать выход оператора из окна
		return Promise.resolve(1);
	}
	
	// Выполняет вход текущего сотрудника в указанное окно
	// 
	// ожидает один параметр: относительный номер окна в офисе.
	// в случае удачного исхода возвращает структу с полями:
	// 
	// , или ошибку с кодом __EQUEUE_XMLRPC_ERRORCODE_DB__
	OperatorEnterWithRelativeId() {
		// @TODO: Важно соблюсти типы полей! где null или строка, там должна быть строка или null
		// где -1 = там должно быть целое 32 бита
		let arrResult = {
			"loginResult": true,
			"loginResultMessage": null,
			"requestId": -1, 
			"requestHrId": null, 
			"requestClientInfo": null, 
			"requestServiceName": null, 
			"requestServiceDesc": null, 
			"requestState": -1,
			"requestWaitTime": this._tr("Undefined"),
			"requestServiceCount": -1,
			"requestTimeLength": -1,
			"requestServiceRPGUCode": ""
		};
		return Promise.resolve(arrResult);
	}
	
	// ожидает два параметра: login и password
	// возвращает true в случае удачного исхода, false - неудачного, 
	// и ошибку с кодом __EQUEUE_XMLRPC_ERRORCODE_DB__, если войти не удалось
	OperatorAuthenticate(params) {
		if (!_.isArray(params) || params.length < 2) {
			throw new Error('Operator was not authenticated: bad params', 2 /* bad param*/);
		}
		let login = params[0], password = params[1], origin = "";
		// @TODO: токен сессии уже должен быть выставлен. 
		// тут надо только зафиксировать вход в событиях, если нужно
		return Promise.resolve(true);
	}
	
	// не ожидает параметров
	// возвращает массив структур с полями, 
	//	"RelativeId" int32
	//	, "HrIdentifier" string
	//	, "HrId" int32
	//	, "DepartmentId" int32
	//	, "DepartmentName" string
	// или ошибку с кодом __EQUEUE_XMLRPC_ERRORCODE_DB__
	OperatorListOperators() {
		// @TODO: получить набор окон, доступных для входа текущим сотрудником
		return Promise.resolve([]);
	}
	
	// Ожидает ни одного, один, либо два параметра: Количество талонов и отступ (limit, offset)
	// При вызове без параметров Возвращает 10 первых талонов для вызова
	// При вызове с одним параметром, возвращает указанное количество талонов (limit), доступных для вызова.
	// При вызове с двумя параметрами возвращает указанное количество талонов, доступных для вызова,
	// с отступом равным значению второго параметра (offset).
	// возвращает массив доступных для вызова талонов
	OperatorGetRequests(params) {
		let limit = 10, offset = 0;
		if (_.isArray(params)) {
			if (params.length > 0) {
				limit = params[0];
			}
			if (params.length > 1) {
				offset = params[1];
			}
		}
		// @TODO: 
		return Promise.resolve([]);
	}
	
	//
	// Админка
	//
	
	// Принимает один параметр:
	// Массив мнемоник настроек, например, (admin_page2_maxcount, administrator_update_timeout, ...)
	// Если массив пуст, возвращается массив со всеми настройками сразу.
	// Возвращает ассоциативный массив значений запрошенных настроек, либо ошибку, 
	// если нет залогиненного сотрудника, не установлен текущий офис, либо неверно задана мнемоника хотя бы одной из настроек.
	SettingsGet(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('Failed to get settings: bad params', 2 /* bad param*/);
		}
		let settings = params[0];
		if (0 === settings.length) {
			// @TODO: если массив settings пуст, вернуть все настройки
			return Promise.resolve({});
		}
		let result = {};
		for (var i = 0; i < settings.length; i++) {
			let setting = settings[i];
			// @TODO: получить значение настройки из базы
			result[setting] = 0;
		}
		return Promise.resolve(result);
	}
	
	// возвращает список услуг
	// params может быть либо пуст, либо содержать два числа: limit и offset
	ListServices(params) {
		let limit = 10, offset = 0;
		if (_.isArray(params)) {
			if (params.length > 0) {
				limit = params[0];
			}
			if (params.length > 1) {
				offset = params[1];
			}
		}
		// возвращаемые поля услуги:
//		$iArray['Id'] = $this->intId;
//		$iArray['Name'] = $this->strName;
//		$iArray['ClientInfoQuestion'] = $this->strClientInfoQuestion;
//		$iArray['Code'] = $this->strCode;
//		$iArray['ComeBackPriority'] = $this->intComeBackPriority;
//		$iArray['Cost'] = $this->intCost;
//		$iArray['EarlyDays'] = $this->intEarlyDays;
//		$iArray['EarlyPercent'] = $this->intEarlyPercent;
//		$iArray['EarlyPercentForCurrentDay'] = $this->intEarlyPercentForCurrentDay;
//		$iArray['ExtendedInfo'] = $this->strExtendedInfo;
//		$iArray['GlobalServiceId'] = $this->intGlobalServiceId;
//		$iArray['GroupOnly'] = $this->blnGroupOnly;
//		$iArray['IconUrl'] = $this->strIconUrl;
//		$iArray['IsClientInfoRequired'] = $this->blnIsClientInfoRequired;
//		$iArray['IsComeBack'] = $this->blnIsComeBack;
//		$iArray['IsComplex'] = $this->blnIsComplex;
//		$iArray['IsEnabled'] = $this->blnIsEnabled;
//		$iArray['IsQualityCheckEnabled'] = $this->blnIsQualityCheckEnabled;
//		$iArray['LiveTimetableId'] = $this->intLiveTimetableId;
//		$iArray['LongDesc'] = $this->strLongDesc;
//		$iArray['MasterServiceId'] = $this->intMasterServiceId;
//		$iArray['OfficeId'] = $this->intOfficeId;
//		$iArray['OivId'] = $this->intOivId;
//		$iArray['OperationEarlyRecordTime'] = $this->intOperationEarlyRecordTime;
//		$iArray['OperationTime'] = $this->intOperationTime;
//		$iArray['Order'] = $this->intOrder;
//		$iArray['Prefix'] = $this->strPrefix;
//		$iArray['Priority'] = $this->intPriority;
//		$iArray['ServiceCountQuestion'] = $this->strServiceCountQuestion;
//		$iArray['ShortDesc'] = $this->strShortDesc;
//		$iArray['TimetableId'] = $this->intTimetableId;
		// @TODO: 
		return Promise.resolve([]);
	}
	
	// ожидает параметр: Id группы услуг, для которой запрашивается список вложенных услуг
	// возвращает список привязанных услуг для указанной группы услуг
	ListRelServiceGroups(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('RelServiceGroups list was not created: bad param', 2 /* bad param*/);
		}
		let serviceGroupId = params[0];
		// возвращаемые поля связей:
//		$iArray['Id'] = $this->intId;
//		$iArray['ServiceId'] = $this->intServiceId;
//		$iArray['ParentServiceId'] = $this->intParentServiceId;

		// @TODO: 
		return Promise.resolve([]);
	}
	
	//
	// WEB-виджет
	//
	
	// не ожидает параметров: возвращает список офисов
	ListOffices() {
		// @TODO: 
		let result = [{
			Id: -1,
			Name: "",
			Address: "",
			AtdId: -1,
			BuildingId: -1, // Номер здания
			Code: "",
			CompanyId: -1,
			CreepingLine: "",
			ExtendedInfo: "",
			IsHeadquarter: false,
			LongDesc: "",
			NotifierCode: "",
			OperatorDisplayLogo: "",
			RoomDisplayLogo: "",
			SecretCode: "", // ПИН-код офиса
			ShortDesc: "",
			TerminalFooter: "",
			TerminalLogoTemplate: "",
			TicketTemplate: "",
		}];
		return Promise.resolve(result);
	}
	
	// принимает номер офиса
	// выставляет указанный офис текущим и возвращает объект этого офиса
	GetOffice(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('Failed to get office: bad params', 2 /* bad param*/);
		}
		let officeId = params[0];
		// @TODO: 
		let result = {
			Id: -1,
			Name: "",
			Address: "",
			AtdId: -1,
			BuildingId: -1, // Номер здания
			Code: "",
			CompanyId: -1,
			CreepingLine: "",
			ExtendedInfo: "",
			IsHeadquarter: false,
			LongDesc: "",
			NotifierCode: "",
			OperatorDisplayLogo: "",
			RoomDisplayLogo: "",
			SecretCode: "", // ПИН-код офиса
			ShortDesc: "",
			TerminalFooter: "",
			TerminalLogoTemplate: "",
			TicketTemplate: "",
		};
		return Promise.resolve(result);
	}
	
	// не ожидает параметров: возвращает номер текущего офиса, если есть.
	GetCurrentOfficeId() {
		// @TODO:
		return null;
	}
	
	// принимает номер офиса
	// выставляет указанный офис текущим
	SetCurrentOfficeId(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('Failed to get office: bad params', 2 /* bad param*/);
		}
		let officeId = params[0];
		// @TODO: 
		return true;
	}
	
	// Отменяет талон с указанным секретным кодом.
	// Принимает два параметра: номер офиса и строка - секретный код талона
	// Возвращает номер отменённого талона, либо ошибку, если отменить талон не удалось
	WithdrawRequest(params) {
		if (!_.isArray(params) || params.length < 2) {
			throw new Error('Failed to get office: bad params', 2 /* bad param*/);
		}
		let officeId = params[0];
		let requestSecretCode = params[1];
		// @TODO: 
		return null;
	}
	
	// не ожидает параметров: возвращает список офисов, для которых включена web-запись
	ListWebOffices() {
		// @TODO: 
		let result = [{
			Id: -1,
			Name: "",
			Address: "",
			AtdId: -1,
			BuildingId: -1, // Номер здания
			Code: "",
			CompanyId: -1,
			CreepingLine: "",
			ExtendedInfo: "",
			IsHeadquarter: false,
			LongDesc: "",
			NotifierCode: "",
			OperatorDisplayLogo: "",
			RoomDisplayLogo: "",
			SecretCode: "", // ПИН-код офиса
			ShortDesc: "",
			TerminalFooter: "",
			TerminalLogoTemplate: "",
			TicketTemplate: "",
		}];
		return Promise.resolve(result);
	}
	
	// Принимает один параметр - номер офиса
	SetCurrentOfficeId(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('Failed to set current office: bad params', 2 /* bad param*/);
		}
		let officeId = params[0];
		// @TODO: выставить текущий офис в сессии
		return Promise.resolve(true);
	}
	
	// принимает один параметр - номер офиса
	// возвращает массив услуг/групп услуг верхнего уровня
	// 
	// Возвращает массив из объектов с полями:
	// Id, Name, ShortDesc, GroupOnly, IsClientInfoRequired и Order
	GetTopLevelServices() {
		// @TODO: 
		return Promise.resolve([]);
	}
	
	// Принимает два параметра - номер офиса и номер группы услуг
	// Возвращает массив всех вложенных в указанную группу и все её подгруппы услуг (рекурсивно)
	// Возвращаемые объекты содержат те же поля:
	// Id, Name, ShortDesc, GroupOnly, IsClientInfoRequired и Order
	GetServicesByOfficeIdGroupId(params) {
		if (!_.isArray(params) || params.length < 2) {
			throw new Error('Failed to get services: bad params', 2 /* bad param*/);
		}
		let officeId = params[0];
		let serviceGroupId = params[1];
		// @TODO: 
		return Promise.resolve([]);
	}
	
	/**
	 * Метод предоставляет информацию о доступных и занятых интервалах времени обслуживания
	 * Возвращает дни, часы и минуты, доступные для записи.
	 * Принимает массив с одним элементом - ассоциативным массивом с полями:
	 * @param {Integer} officeId Номер офиса - обязательный параметр.
	 * @param {Integer} svcId Номер услуги - обязательный параметр, либо:
	 * @param {Integer} globalSvcId Номер глобальной услуги - обязательный параметр
	 * @param {Integer} serviceCount Число дел (1 по умолчанию)
	 * @param {Integer} employeeId Номер сотрудника, или 0, если для любого (значение по умолчанию)
	 * @param {Integer} opId Номер оператора, или 0, если для любого (значение по умолчанию)
	 * @param {Integer} day День, на который запрашиваются времена. Если не указан, или null, возвращаются все дни.
	 * @param {boolean} bFirstAvailable Если === true, возвращает true, при нахождении первого доступного для записи времени. Если таких не обнаружено, возвращает false.
	 * @return {[Object]} дни, для которых доступна запись на указанную услугу
	 * вместе с временами, на которые она доступна (по всем операторам)
	 * [{day: 2, times: [{hour: 12, minutes: [25, 50]}, {hour: 13, minutes: [15, 40]}]}]
	 */
	ListTimesAvailable(params) {
		if (!_.isArray(params) || params.length < 1) {
			throw new Error('Failed to list times available: bad params', 2 /* bad param*/);
		}
		let strParams = params[0];
		// @TODO: 
		return Promise.resolve([]);
	}
	
	CreateRequest(params) {
		if (!_.isArray(params) || params.length < 2) {
			throw new Error('Failed to create request: bad params', 2 /* bad param*/);
		}
		// Первый параметр игнорируем
		// 
		// Второй параметр содержит:
//		// Номер услуги в БД
//		'svcId': $intServiceId
//		// Число дел
//		, 'serviceCount': $intServiceCount
//		// ФИО посетителя
//		, 'FIO': 'Иванов Иван'
//		// время, на которое запрашивается запись, в формате чч:мм:сс
//		, 'timeBegin': $dttRecordDateTime->qFormat("hhhh:mm:ss")
//		// дата, на которую запрашивается запись, в формате ГГГГ/ММ/ДД
//		, 'dateBegin': $dttRecordDateTime->qFormat("YYYY/MM/DD")
//		// Продолжительность обслуживания по запрошенной услуге и числу дел, в секундах
//		, 'timeLength': 60 * $intRecordLength
//		// Тип записи: 0 - живая очередь (ЖО); 1 - предварительная запись (ПЗ)
//		, 'type': 1 // для WEB-виджета это всегда 1
		let strParams = params[1];
		// @TODO: Создать талон в БД. Если не удалось, вернуть ошибку (кинуть исключение)
		// иначе вернуть талон с полями:
//		'OFFICE_CODE': $officeCode
//		, 'OFFICE_ADDRESS': $officeAddress
//		, 'TICKET_TYPE': $req->Type->Name
//		, '_TICKET_TYPE_ID': $req->TypeId
//		, '_TICKET_STATE_ID': $req->StateId
//		// Не показывать это дело для талонов ПЗ (https://irisdev/iristrac/ticket/1713)
//		, 'QUEUE_POSITION': (1/* Живая очередь */ == $req->TypeId ? $intBestQueuePosition : '')
//		, 'SVC_WINDOW_NUMBERS': $strOperators
//		, 'TICKET_CODE': $req->Date->qFormat('YYYYMMDD') . "-" . $req->HrId
//		, 'TICKET_REGISTRATION_DATE': $strReqRegDate
//		, 'TICKET_REGISTRATION_TIME': $strReqRegTime
//		, 'TICKET_DATE': $strReqDate
//		, 'TICKET_TIME': $strReqTime
//		, 'DATE': $strNowDate
//		, 'TIME': $strNowTime
//		, 'USER_NAME': $req->ClientInfo
//		//"['SVC_CODE','" . $svc->Code . "']," .
//		, 'PRINT_TICKET_TIME': 0
//		, 'SVC_COUNT': $req->ServiceCount
//		, 'REQUEST_ID': $req->Id
//		, 'REQUEST_DATETIME': $req->Date->qFormat('YYYY-MM-DD') . "T" . $req->TimeBegin->qFormat('hhhh:mm:ss')
//		, 'OIV': ($tmpOiv ? $tmpOiv->Name : '')
//		, 'TICKET_ID': $strTicketId
//		, 'TICKET_ADD_TEXT': QApplication::HtmlEntities(trim($strTicketAddText))
//		/* специальное служебное значение. используется для выбора шаблона талона */
//		, 'DEPARTMENT_ID': $intDepartmentId
//		// печать времени для талонов предвозаписи
//		$strPrintCmd['PRINT_TICKET_TIME'] = 1;
//		$strPrintCmd['SECRET_CODE'] = $req->SecretCode;
//		//$strPrintCmd['NO_PRINT'] = 'true';
//		$strPrintCmd['TICKET_BARCODE'] = $strTicketBarcode;
//		$strPrintCmd['SVC_NAME'] = $svc->Name;
//		$strPrintCmd['SVC_DESC'] = $svc->ShortDesc;
//		$strPrintCmd['SVC_LONG_DESC'] = $svc->LongDesc;
//		$strPrintCmd['SVC_CODE'] = "";
//		$strPrintCmd['EMPLOYEE'] = "";
//		$strPrintCmd['EMPLOYEE_FIO'] = "";
		throw new Error('FIXME!');
		//return Promise.resolve([]);
	}
}

module.exports = XmlRpcV1;