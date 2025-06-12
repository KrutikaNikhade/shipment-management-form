const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIRL = "/api/irl";
const jpdbIML = "/api/iml";
const DB_NAME = "DELIVERY-DB";
const RELATION_NAME = "SHIPMENT-TABLE";
const connToken = "90934582|-31949213424846081|90956647";

function saveRecNoToLS(jsonObj) {
    const data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

function getShipmentAsJson() {
    const shipNo = $("#shipNo").val();
    return JSON.stringify({ "Shipment-No.": shipNo });
}

function fillData(jsonObj) {
    const data = JSON.parse(jsonObj.data).record;
    $("#description").val(data.Description);
    $("#source").val(data.Source);
    $("#destination").val(data.Destination);
    $("#shipDate").val(data["Shipping-Date"]);
    $("#deliveryDate").val(data["Expected-Delivery-Date"]);
}

function resetForm() {
    $("#shipNo").val("");
    $("#description").val("");
    $("#source").val("");
    $("#destination").val("");
    $("#shipDate").val("");
    $("#deliveryDate").val("");
    $("#shipNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);

    $("input").prop("disabled", true);
    $("#shipNo").prop("disabled", false);
}

function validateData() {
    const shipNo = $("#shipNo").val();
    const description = $("#description").val();
    const source = $("#source").val();
    const destination = $("#destination").val();
    const shipDate = $("#shipDate").val();
    const deliveryDate = $("#deliveryDate").val();

    if (!shipNo || !description || !source || !destination || !shipDate || !deliveryDate) {
        alert("All fields are required!");
        return "";
    }

    return JSON.stringify({
        "Shipment-No.": shipNo,
        "Description": description,
        "Source": source,
        "Destination": destination,
        "Shipping-Date": shipDate,
        "Expected-Delivery-Date": deliveryDate
    });
}

function getShipment() {
    const shipNoJson = getShipmentAsJson();
    const getReq = createGET_BY_KEYRequest(connToken, DB_NAME, RELATION_NAME, shipNoJson);

    jQuery.ajaxSetup({ async: false });
    const resJson = executeCommandAtGivenBaseUrl(getReq, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJson.status === 400) {
        $("#save").prop("disabled", false);
        $("#change").prop("disabled", true);
        enableFields();
        $("#description").focus();
    } else if (resJson.status === 200) {
        $("#shipNo").prop("disabled", true);
        fillData(resJson);
        saveRecNoToLS(resJson);
        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        enableFields();
        $("#description").focus();
    }
}

function enableFields() {
    $("#description").prop("disabled", false);
    $("#source").prop("disabled", false);
    $("#destination").prop("disabled", false);
    $("#shipDate").prop("disabled", false);
    $("#deliveryDate").prop("disabled", false);
}

function saveData() {
    const jsonStr = validateData();
    if (!jsonStr) return;

    const putReq = createPUTRequest(connToken, jsonStr, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(putReq, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#shipNo").focus();
}

function changeData() {
    const jsonStr = validateData();
    if (!jsonStr) return;

    const updateReq = createUPDATERecordRequest(
        connToken,
        jsonStr,
        DB_NAME,
        RELATION_NAME,
        localStorage.getItem("recno")
    );

    jQuery.ajaxSetup({ async: false });
    const res = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#shipNo").focus();
}
